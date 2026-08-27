import { readdir, readFile, stat, unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const TEXT_OUTPUT = /\.(html|css|js|mjs|json|xml|txt|webmanifest)$/i;
const IMAGE_OUTPUT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

async function collectText(dir) {
  const chunks = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) chunks.push(...(await collectText(full)));
    else if (TEXT_OUTPUT.test(entry.name)) chunks.push(await readFile(full, 'utf8'));
  }
  return chunks;
}

export default function pruneUnusedImages({ assetsDir = '_astro' } = {}) {
  return {
    name: 'prune-unused-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const assets = path.join(root, assetsDir);

        const referenced = (await collectText(root)).join('\n');

        let removed = 0;
        let bytes = 0;

        for (const name of await readdir(assets)) {
          if (!IMAGE_OUTPUT.test(name) || referenced.includes(name)) continue;
          const target = path.join(assets, name);
          bytes += (await stat(target)).size;
          await unlink(target);
          removed += 1;
        }

        logger.info(
          `pruned ${removed} unreferenced images (${(bytes / 1024 / 1024).toFixed(2)} MB)`
        );
      },
    },
  };
}
