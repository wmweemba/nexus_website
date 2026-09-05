// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output only — no server runtime, no adapter. See docs/DECISIONS.md.
export default defineConfig({
  output: 'static',
  site: 'https://mynexusgroup.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
