import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Case studies are the one piece of site content that repeats in shape (client, sector,
// outcome) and grows over time (p5-casestudy adds a second entry once consent clears),
// so it gets a real collection. Every other route is bespoke Astro markup driven by the
// drafts in docs/copy/ — a single collection for one-off pages would just be indirection.
const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    sector: z.enum([
      'microfinance-lending',
      'professional-services',
      'food-production-retail',
      'ngo-association',
    ]),
    summary: z.string().max(200),
    // Whether the client has given written consent to be named publicly.
    // See docs/DECISIONS.md "Case study client consent" — unpublished until true.
    published: z.boolean().default(false),
    order: z.number(),
  }),
});

export const collections = { 'case-studies': caseStudies };
