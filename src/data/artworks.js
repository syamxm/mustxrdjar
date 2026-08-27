import { alt } from './alt.js';

const paintedFiles = import.meta.glob('/art/painted/*.{jpg,png}', { eager: true, import: 'default' });
const sketchedFiles = import.meta.glob('/art/sketched/*.{jpg,png}', { eager: true, import: 'default' });

function toArtworks(files, body) {
  return Object.entries(files)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, image], index) => {
      const slug = path.split('/').pop().replace(/\.[^.]+$/, '');
      return {
        slug,
        body,
        image,
        alt: alt[slug] ?? '',
        plate: (index % 6) + 1,
        rot: [-3.5, 2.5, -1.5, 4, -2.5, 1.5, -4, 3][index % 8],
      };
    });
}

export const painted = toArtworks(paintedFiles, 'painted');
export const sketched = toArtworks(sketchedFiles, 'sketched');
export const all = [...painted, ...sketched];
