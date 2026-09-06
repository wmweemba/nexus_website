/**
 * Sitemap endpoint, not a static file — generated from the case-studies
 * collection at build time so it can never drift from what /work/ actually
 * publishes. Astro prerenders this to a static sitemap.xml file since the
 * whole site builds with output: 'static'. See docs/DECISIONS.md — p6-visibility.
 */
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const staticPages = [
  { path: '/', changefreq: 'monthly', priority: '1.0' },
  { path: '/services/', changefreq: 'monthly', priority: '0.9' },
  { path: '/services/security-awareness/', changefreq: 'monthly', priority: '0.9' },
  { path: '/work/', changefreq: 'monthly', priority: '0.8' },
  { path: '/about/', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact/', changefreq: 'monthly', priority: '0.7' },
];

export const GET: APIRoute = async ({ site }) => {
  const caseStudies = await getCollection('case-studies', ({ data }) => data.published);
  const lastmod = new Date().toISOString().split('T')[0];

  const urls = [
    ...staticPages.map((page) => ({ ...page, loc: new URL(page.path, site).href })),
    ...caseStudies.map((study) => ({
      loc: new URL(`/work/${study.id}/`, site).href,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
