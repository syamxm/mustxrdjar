import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mustxrdjar.syamxm.com',
  base: '/',
  output: 'static',
  server: { host: '127.0.0.1', port: 4321 },
  build: { inlineStylesheets: 'auto' },
  image: {
    responsiveStyles: true,
  },
});
