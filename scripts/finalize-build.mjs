import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { parseFrontmatter } from '../src/lib/frontmatter.ts';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const deployment = JSON.parse(readFileSync('site.config.json', 'utf8'));
const site = (env.VITE_SITE_URL || deployment.url || '').replace(/\/$/, '');
if (site && !/^https?:\/\//.test(site)) throw new Error('VITE_SITE_URL must be an absolute HTTP(S) URL');
const escape = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const file = resolve('dist/index.html');
let html = readFileSync(file, 'utf8');
if (site) {
  html = html.replace(/<link\b[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escape(site)}/">`);
  html = html.replace(/<meta\b[^>]*property="og:url"[^>]*>/i, `<meta property="og:url" content="${escape(site)}/">`);
  html = html.replace(/<meta\b[^>]*property="og:image"[^>]*>/i, `<meta property="og:image" content="${escape(site)}/images/og.png">`);
  html = html.replace(/<meta\b[^>]*name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escape(site)}/images/og.png">`);
} else {
  // The first private preview has no assigned URL yet; do not assert a guessed canonical.
  html = html.replace(/<link\b[^>]*rel="canonical"[^>]*>/i, '').replace(/<meta\b[^>]*property="og:url"[^>]*>/i, '');
}
writeFileSync(file, html);

const posts = readdirSync('src/content/posts').filter(name => name.endsWith('.md')).map(name => {
  const {data} = parseFrontmatter(readFileSync(resolve('src/content/posts', name), 'utf8'));
  return { ...data, slug: name.slice(0, -3) };
}).filter(post => post.draft !== true).sort((a, b) => String(b.date).localeCompare(String(a.date)));
const link = (path = '/') => `${site || '.'}/#${path}`;
const items = posts.map(post => `<item><title>${escape(post.sample ? '[Sample] ' + post.title : post.title)}</title><link>${escape(link(`/articles/${post.slug}`))}</link><guid isPermaLink="true">${escape(link(`/articles/${post.slug}`))}</guid><description>${escape((post.sample ? 'Sample content from the site template. ' : '') + (post.description || ''))}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`).join('');
writeFileSync('dist/rss.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>barriuso — Offensive Security Research</title><link>${escape(site || './')}</link><description>Security research notes by barriuso.</description><language>en</language>${items}</channel></rss>`);
// Fragment routes are one document to search engines; do not put hash routes in a sitemap.
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${site ? `<url><loc>${escape(site)}/</loc></url>` : ''}</urlset>`);
writeFileSync('dist/robots.txt', site ? `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n');
console.log(`Prepared ${posts.length} RSS entries and site metadata${site ? ` for ${site}` : ' for the initial private preview'}.`);
