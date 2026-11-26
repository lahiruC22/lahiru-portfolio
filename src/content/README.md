# Portfolio content

This directory contains the portfolio's editable content, separated from the UI.

## Files

- `profile.json` — headline, summary, contact links and résumé path.
- `experience.json` — employers, roles, products, and product-specific contributions.
- `skills.json` — skill categories and items.
- `education.json` — education history.
- `projects.json` — personal, freelance, and data-analysis project details.
- `research.json` — completed research write-ups, publications, interests, and active/planned directions. Bracketed case-study text is an editorial placeholder to replace with verified research details.
- `certifications.json` — credentials with optional verified type, issuer, completion date, URL, ID, and certificate image.

## Recommended integration

Keep these files in the application's source tree, for example:

```text
src/
  content/
    profile.json
    experience.json
    skills.json
    education.json
    projects.json
    research.json
    certifications.json
  components/
  pages/
```

For a Vite/React or Next.js application, import JSON directly:

```ts
import profile from '@/content/profile.json';
import experience from '@/content/experience.json';
import skills from '@/content/skills.json';
import education from '@/content/education.json';
import projects from '@/content/projects.json';
import research from '@/content/research.json';
import credentials from '@/content/certifications.json';
```

Then pass the data into presentation components:

```tsx
<ExperienceTimeline experiences={experience.experiences} />
<SkillsSection categories={skills.categories} />
<ProjectGrid projects={projects.projects} />
```

The components should render data; they should not contain hardcoded employer names, dates, contribution paragraphs, technology lists, or project URLs.

## Experience data model

`experience.json` follows this hierarchy:

```text
experiences[]
  employer
  role
  employment dates
  projects[]
    product or internal initiative
    description
    role context
    contributions[]
      title
      description
      technologies[]
```

This lets one employer have multiple products and lets each product have its own contributions and technology list. The browser extension is explicitly an `Internal initiative`, separate from SAS Connect.

## Updating content

For a routine content change:

1. Edit the relevant JSON file.
2. Keep existing `id` values stable. They are useful for React keys, URLs, and tests.
3. Add a new contribution as a new object in the relevant product's `contributions` array.
4. Update technologies only when they were actually used for that contribution or product.
5. Run the application's formatting, lint, type-check, tests, and build.
6. Review the page at desktop and mobile widths.

No component changes should be needed for ordinary text, date, URL, or technology-list updates.

## Rules for the coding agent

- Treat these JSON files as the source of truth for portfolio content.
- Do not duplicate their content as string literals inside React components.
- Do not invent metrics, product responsibilities, technology attribution, or outcomes.
- Keep employer-to-product relationships intact.
- Do not merge internal initiatives into public client/product entries.
- If a contribution is unclear, leave it out or add it to a separate review list instead of guessing.
- Validate JSON and run the application checks after edits.

## Content accuracy notes

- The iLabs contributions are associated with Cloud of Goods, as confirmed by the user. The résumé does not identify the exact rental-business workflow, dataset, or model involved.
- The browser extension is an internal Visonex Digital initiative, separate from SAS Connect.
- The PEO Mobile CDN and AWS WAF work was supplied by the user in addition to the résumé.
- The education classification `Second Class Upper Division` was confirmed by the user separately; the résumé itself lists the degree and GPA but not the classification.
- Set a credential type only after checking an issuer source. Leave unavailable metadata null; do not infer credential IDs or certificate images from profile links.
- The résumé spells the employer `Visonex Digital`. Confirm the official spelling before publishing if the company uses a different spelling.
- The phone number is intentionally omitted from `profile.json`; add it only if you want it publicly displayed.
- Replace the résumé file path with the actual public asset path used by the application.
