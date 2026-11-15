import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function resolveSiteUrl() {
  const rawUrl =
    process.env.VITE_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    '';

  if (!rawUrl) return '';
  const withProtocol = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  return withProtocol.replace(/\/+$/, '');
}

const ogUrlPlugin = () => ({
  name: 'og-url-transform',
  transformIndexHtml(html) {
    const siteUrl = resolveSiteUrl();
    if (!siteUrl) return html;
    return html
      .replaceAll('content="/og-image.png"', `content="${siteUrl}/og-image.png"`)
      .replace('</head>', `    <meta property="og:url" content="${siteUrl}/" />\n  </head>`);
  },
});

export default defineConfig({
  plugins: [react(), ogUrlPlugin()],
  server: {
    port: 5173,
    open: true,
  },
});
