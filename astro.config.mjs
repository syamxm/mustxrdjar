import { defineConfig } from 'astro/config';
import pruneUnusedImages from './integrations/prune-unused-images.mjs';

export default defineConfig({
  site: 'https://mustxrdjar.syamxm.com',
  base: '/',
  output: 'static',
  integrations: [pruneUnusedImages()],
  server: { host: '127.0.0.1', port: 4321 },
  preview: { host: '127.0.0.1', port: 4321 },
  build: { inlineStylesheets: 'auto' },
  image: {
    responsiveStyles: true,
  },
});
