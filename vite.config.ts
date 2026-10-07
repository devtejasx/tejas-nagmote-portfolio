/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/** Emits robots.txt and sitemap.xml for whatever absolute URL the site is built for. */
function seoFiles(siteUrl: string): Plugin {
  const base = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`
  return {
    name: 'seo-files',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          `  <url><loc>${base}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`,
          '</urlset>',
          '',
        ].join('\n'),
      })
    },
  }
}

// A relative base keeps the build portable: the same dist/ works at a domain
// root (Vercel, Netlify) and under a sub-path (GitHub Pages project sites).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    base: './',
    plugins: [react(), seoFiles(env.VITE_SITE_URL)],
    build: {
      target: 'es2022',
      // three.js is lazy-loaded into its own chunk; it is legitimately large.
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          // Name the lazily loaded 3D vendor chunk after what is in it. This
          // only renames the file; it does not change how modules are grouped.
          chunkFileNames: (chunk) =>
            chunk.moduleIds.some((id) => /node_modules[\\/]three[\\/]/.test(id))
              ? 'assets/three-[hash].js'
              : 'assets/[name]-[hash].js',
        },
      },
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
    },
  }
})
