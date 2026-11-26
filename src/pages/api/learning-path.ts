import type { APIRoute } from 'astro';
import { writingArticles } from '../../lib/content';

interface PathStep {
  position: number;
  title: string;
  slug: string;
  mediumUrl: string;
  summary: string;
  whyThisStep: string;
  keyTakeaways: string[];
  relatedProjects: string[];
  readingTime?: string;
  tags: string[];
}

interface LearningPathResponse {
  topic: string;
  pathTitle: string;
  pathDescription: string;
  steps: PathStep[];
  totalReadingTime: string | null;
  nextSteps: string[];
}

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await request.json()) as { topic: string };
    const { topic } = body;

    if (!topic || topic.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (writingArticles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No published articles are available for a learning path yet.' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not set in environment');
      return new Response(
        JSON.stringify({
          error: 'API not configured. Set ANTHROPIC_API_KEY environment variable.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare published Medium article metadata for Claude.
    const blogSummary = writingArticles
      .map(
        (post) =>
          `- "${post.title}" (slug: ${post.slug}): ${post.summary}\n  Topics: ${post.topics.join(', ')}\n  Related projects: ${post.relatedProjects.join(', ')}`
      )
      .join('\n');

    const prompt = `You are an expert learning path curator. Given a topic or skill a user wants to learn, create an optimal learning sequence from these published Medium articles.

Available Published Medium Articles:
${blogSummary}

User's Learning Goal: "${topic}"

Your task:
1. Analyze the user's goal and select the MOST RELEVANT blog posts (2-4 posts).
2. Order them from foundational to advanced concepts.
3. Explain WHY each post is in this sequence (prerequisite knowledge, building on concepts, etc.).
4. Suggest what they should explore next after finishing this path.

IMPORTANT: Only include articles from the "Available Published Medium Articles" list above. Do not make up articles.

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "topic": "${topic}",
  "pathTitle": "Brief title for this learning path",
  "pathDescription": "1-2 sentence description of what they'll learn",
  "steps": [
    {
      "position": 1,
      "slug": "post-slug-here",
      "whyThisStep": "Why this post comes first in the sequence"
    }
  ],
  "nextSteps": ["concept or skill to explore after this path"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Claude API error:', error);
      return new Response(JSON.stringify({ error: 'Failed to generate learning path' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = (await response.json()) as {
      content: Array<{ type: string; text: string }>;
    };
    const content = data.content[0];

    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse Claude's response
    let parsedPath;
    try {
      parsedPath = JSON.parse(content.text);
    } catch {
      console.error('Failed to parse Claude response:', content.text);
      return new Response(JSON.stringify({ error: 'Invalid response from AI' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Enrich the path with curated Medium metadata.
    const enrichedSteps: PathStep[] = parsedPath.steps.map(
      (step: { position: number; slug: string; whyThisStep: string }) => {
        const blogPost = writingArticles.find((p) => p.slug === step.slug);
        if (!blogPost) {
          throw new Error(`Blog post not found: ${step.slug}`);
        }

        return {
          position: step.position,
          title: blogPost.title,
          slug: blogPost.slug,
          mediumUrl: blogPost.mediumUrl,
          summary: blogPost.summary,
          whyThisStep: step.whyThisStep,
          keyTakeaways: blogPost.keyTakeaways,
          relatedProjects: blogPost.relatedProjects,
          readingTime: blogPost.readingTime,
          tags: blogPost.tags,
        };
      }
    );

    // Calculate total reading time (rough estimate)
    const readingMinutes = enrichedSteps.map((step) => {
      const match = step.readingTime?.match(/\d+/);
      return match ? Number.parseInt(match[0], 10) : null;
    });
    const totalReadingTime = readingMinutes.every((minutes) => minutes !== null)
      ? `${readingMinutes.reduce((sum, minutes) => sum + (minutes ?? 0), 0)} min`
      : null;

    const result: LearningPathResponse = {
      topic,
      pathTitle: parsedPath.pathTitle || 'Learning Path',
      pathDescription: parsedPath.pathDescription || '',
      steps: enrichedSteps,
      totalReadingTime,
      nextSteps: parsedPath.nextSteps || [],
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Learning path API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to generate learning path',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
