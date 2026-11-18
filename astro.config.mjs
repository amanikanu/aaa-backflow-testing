import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  // Hybrid output: pages are prerendered (static, served from the CDN),
  // while the contact API route is a serverless function.
  output: 'hybrid',
  adapter: netlify(),
  site: 'https://www.aaabft.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
  ],
  // Legacy URL redirects required by the PRD (13.5 / 13.4 #1).
  // In static/hybrid output these are emitted as meta-refresh files
  // that also carry a canonical link to the new route.
  redirects: {
    '/index.html': '/',
    '/faqs.html': '/faq/',
    '/aboutus.html': '/about/',
  },
  image: {
    // We keep images minimal and self-hosted; AVIF/WebP are supported by Astro.
    formats: ['avif', 'webp'],
  },
  // Allow the dev/preview proxy host. Astro 4.16 does not forward
  // `server.allowedHosts` to Vite, so we set it through the `vite` key.
  // The sandbox preview host is dynamic; add the current one here (or use `true`
  // to disable the check locally). In production, scope this to your domain.
  server: {
    host: true,
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});
