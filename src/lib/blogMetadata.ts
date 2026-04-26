export interface BlogPostMetadata {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  topics: string[]; // what topics this teaches
  prerequisites: string[]; // what topics should come first
  relatedProjects: string[]; // related project slugs
  keyTakeaways: string[];
}

export const blogMetadata: BlogPostMetadata[] = [
  {
    slug: 'idempotency-patterns-event-driven-services',
    title: 'Idempotency Patterns for Event-Driven Services',
    summary:
      'Designing event workflows that remain correct under retries, duplicates, and partial failures.',
    tags: ['event-driven', 'backend', 'reliability'],
    topics: [
      'event-driven architecture',
      'idempotency',
      'reliability patterns',
      'retry logic',
      'state management',
    ],
    prerequisites: ['backend fundamentals'],
    relatedProjects: ['event-sourced-billing-core'],
    keyTakeaways: [
      'Idempotency key + scoped operation pattern',
      'State lookup vs re-execution',
      'Durable event logs for resilience',
    ],
  },
  {
    slug: 'diagnosing-slow-api-paths-incremental-profiling',
    title: 'Diagnosing Slow API Paths with Incremental Profiling',
    summary:
      'A stepwise method for reducing latency blind spots across application and database boundaries.',
    tags: ['performance', 'profiling', 'go'],
    topics: [
      'performance optimization',
      'profiling methodology',
      'latency analysis',
      'observability',
      'tracing',
    ],
    prerequisites: ['backend fundamentals'],
    relatedProjects: ['adaptive-model-inference-router'],
    keyTakeaways: [
      'Coarse-grained tracing to locate high variance',
      'Targeted CPU and allocation profiles',
      'Performance budgets and alerting',
    ],
  },
  {
    slug: 'practical-trade-offs-kubernetes-autoscaling',
    title: 'Practical Trade-offs in Kubernetes Autoscaling',
    summary: 'Balancing cost, latency, and stability when designing autoscaling policies.',
    tags: ['kubernetes', 'sre', 'platform'],
    topics: [
      'kubernetes',
      'autoscaling',
      'control systems',
      'infrastructure scaling',
      'sre practices',
    ],
    prerequisites: ['kubernetes basics', 'monitoring'],
    relatedProjects: ['kubernetes-workload-recovery-engine'],
    keyTakeaways: [
      'Autoscaling as a control system not a toggle',
      'Workload characterization before tuning',
      'Coordinating horizontal and vertical scaling',
    ],
  },
  {
    slug: 'prototype-to-production-serving-ml-models-safely',
    title: 'From Prototype to Production: Serving ML Models Safely',
    summary: 'Operational guardrails that turn model demos into reliable production services.',
    tags: ['mlops', 'ai', 'production'],
    topics: ['mlops', 'model serving', 'production ml', 'operational safety', 'canary deployments'],
    prerequisites: ['ml basics', 'backend fundamentals'],
    relatedProjects: ['adaptive-model-inference-router', 'vector-retrieval-orchestration-api'],
    keyTakeaways: [
      'Model versioning and observability',
      'Shadow traffic and canary rollouts',
      'Drift and data quality monitoring',
    ],
  },
];

export function findBlogsByTopic(topic: string): BlogPostMetadata[] {
  const lowerTopic = topic.toLowerCase();
  return blogMetadata.filter(
    (post) =>
      post.topics.some((t) => t.toLowerCase().includes(lowerTopic)) ||
      post.tags.some((t) => t.toLowerCase().includes(lowerTopic)) ||
      post.title.toLowerCase().includes(lowerTopic)
  );
}
