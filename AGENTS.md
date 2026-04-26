# AI Agent Guide: Lahiru's Portfolio

## Quick Start

**Tech Stack**: Astro 6 + TypeScript + Tailwind v4, deployed on Netlify  
**Package Manager**: pnpm 10.33.0+  
**Node**: ≥22.12.0

### Essential Commands

```bash
pnpm dev       # Start dev server (localhost:4321)
pnpm build     # Build to ./dist
pnpm preview   # Preview production build
pnpm astro     # Run Astro CLI commands
```

## Project Structure

```
src/
├── pages/           # Route files (SSG)
│  ├── blog/[slug].astro   # Dynamic blog post routes
│  ├── projects/[slug].astro  # Dynamic project routes
│  └── api/          # API endpoints (/api/learning-path.ts)
├── components/
│  ├── Navbar.astro  # Navigation (shared across pages)
│  ├── Layout.astro  # Root layout wrapper
│  └── sections/     # Page-specific sections (Hero, Footer, etc.)
├── layouts/
│  └── Layout.astro  # Metadata + page structure
├── lib/
│  └── blogMetadata.ts  # Blog post data + helper functions
└── styles/
   └── global.css    # Tailwind theme variables
```

**Key Pages**:
- `/` (index.astro) - Home with hero section
- `/blog` - Blog listing
- `/blog/[slug]` - Individual blog posts
- `/projects` - Projects listing
- `/experience` - Experience page
- `/learning-path` - AI learning path generator
- `/contact` - Contact page
- `/api/learning-path` - Claude API endpoint (POST only)

## Component Conventions

### File Naming & Locations

| Type | Pattern | Location |
|------|---------|----------|
| Page | PascalCase | `src/pages/` or `src/pages/[slug].astro` |
| Reusable Component | PascalCase | `src/components/` |
| Page Sections | PascalCase | `src/components/sections/` |
| Utilities | camelCase | `src/lib/` |
| Routes (URL) | kebab-case | `/blog/post-title`, `/learning-path` |

### Component Structure

All `.astro` components use **frontmatter** (TypeScript + Astro logic):

```astro
---
// Imports
import Layout from '../layouts/Layout.astro';

// Props interface (required for reusable components)
interface Props {
  title: string;
  date: string;
}

const { title, date } = Astro.props;
// Component logic here
---

<!-- HTML template -->
<Layout {title}>
  <h1>{title}</h1>
  <time>{date}</time>
</Layout>
```

**Guidelines**:
- Always define `Props` interfaces in frontmatter
- Use `transition:name`, `transition:animate` for Astro View Transitions
- Semantic HTML with ARIA labels for accessibility

## Styling

### Tailwind Configuration

- **Framework**: Tailwind v4 + `@tailwindcss/vite` plugin
- **No CSS modules** – use Tailwind classes only
- **Prettier plugin** auto-sorts class order

### Theme Variables

Defined in [src/styles/global.css](src/styles/global.css):

```css
--color-primary: /* Primary text color */
--color-secondary: /* Secondary text color */
--font-heading: /* Heading font (Lora) */
--font-body: /* Body font (Inter Variable) */
--font-mono: /* Monospace (JetBrains Mono) */
```

Usage in components:

```astro
<h1 class="font-heading text-primary">Title</h1>
```

## Data Management

### Static Content

All content is **static** – no database:

- **Blog metadata**: [src/lib/blogMetadata.ts](src/lib/blogMetadata.ts) exports blog posts with topics, tags, reading times, prerequisites
- **Projects**: Hard-coded in page files
- **Helper functions**: `findBlogsByTopic()`, `getRelatedPosts()` in blogMetadata.ts

**Pattern**: Import metadata, filter/map for display:

```typescript
import { posts } from '../lib/blogMetadata';
const recentPosts = posts.filter(p => p.date > '2026-01-01');
```

### Dynamic Routes

Use `[slug]` pattern for content:

```
src/pages/blog/[slug].astro    // ✓ Correct
src/pages/projects/[slug].astro // ✓ Correct
```

Astro generates static routes at build time for each slug.

## API Endpoints

### Location & Pattern

File: `src/pages/api/learning-path.ts`

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    // API logic here
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
  }
};
```

**Environment Variables**: Access via `import.meta.env.VARIABLE_NAME`

- `ANTHROPIC_API_KEY` – For Claude API calls (Netlify only)

## TypeScript & Linting

- **TSConfig**: `astro/tsconfigs/strict` (strict mode enabled)
- **No ESLint** – Prettier handles code formatting only
- **Formatter**: Prettier v3.8.3 with astro + tailwindcss plugins

Run formatting:

```bash
pnpm exec prettier --write .
```

## Key Patterns & Conventions

### Token-based Animations

Many elements use custom animations via CSS variables:

```astro
<h1 
  style="--text-delay: 120ms; --token-stagger: 95ms"
  data-writing-text
>
  Animated text
</h1>
```

See home page (index.astro) for examples.

### SEO & Open Graph

All pages use [Layout.astro](src/layouts/Layout.astro) which includes:

- Canonical URLs
- Structured data (schema.org Person)
- Open Graph tags
- Meta descriptions

Pass `title`, `description`, `ogImage`, `ogType` to Layout:

```astro
<Layout 
  title="Page Title"
  description="Page description for SEO"
  ogImage="/og-image.png"
>
```

### Sitemap Generation

Auto-generated by `@astrojs/sitemap` integration in [astro.config.mjs](astro.config.mjs).

Site URL: `https://lahiruwimalarathna.netlify.app/`

## Deployment

**Platform**: Netlify  
**Build Command**: `pnpm build` → outputs to `./dist`  
**Required Env Vars**: `ANTHROPIC_API_KEY` (for learning path API)

## Common Tasks

| Task | Steps |
|------|-------|
| Add new page | Create `src/pages/new-page.astro`, import Layout, add title + content |
| Add blog post | Add entry to [blogMetadata.ts](src/lib/blogMetadata.ts), then create `src/pages/blog/[slug].astro` |
| Modify styling | Edit Tailwind classes in components or update theme vars in [global.css](src/styles/global.css) |
| Update navigation | Edit [Navbar.astro](src/components/Navbar.astro) links |
| Call Claude API | POST to `/api/learning-path` with topic, uses `ANTHROPIC_API_KEY` |

## Useful Links

- [Astro Documentation](https://docs.astro.build)
- [Tailwind v4 Docs](https://tailwindcss.com/docs)
- [Repository memory notes](/memories/repo/learning-path-agent.md) – Learning path generator architecture

## Notes for AI Agents

- **Type Safety**: Always define interfaces for component props and API responses
- **No Third-party APIs** (except Claude) – all content is static
- **One Layout per Page**: Use Layout.astro as wrapper for all pages
- **Prettier Auto-formats**: Don't worry about class order in Tailwind
- **Build is SSG**: All pages are pre-rendered at build time
