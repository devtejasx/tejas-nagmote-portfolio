/// <reference types="vitest/config" />
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/** Case-study pages: one static HTML entry per folder in projects/. */
const caseStudyIds = readdirSync(resolve(import.meta.dirname, 'projects'), { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

/** Emits robots.txt and sitemap.xml for whatever absolute URL the site is built for. */
function seoFiles(siteUrl: string): Plugin {
  const base = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`
  const today = new Date().toISOString().slice(0, 10)
  const urls = [base, ...caseStudyIds.map((id) => `${base}projects/${id}/`)]
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
          ...urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`),
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
      // three.js is lazy-loaded into its own chunk, only when a visitor opens
      // the optional 3D architecture view; it is legitimately large.
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
          ...Object.fromEntries(
            caseStudyIds.map((id) => [
              id,
              resolve(import.meta.dirname, 'projects', id, 'index.html'),
            ]),
          ),
        },
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
