import { docs } from 'collections';
import { loader } from 'fumadocs-core/source';

const fumadocsSource = docs.toFumadocsSource();

export const source = loader({
  baseUrl: '/docs',
  source: {
    ...fumadocsSource,
    files: typeof fumadocsSource.files === 'function'
      ? fumadocsSource.files()
      : fumadocsSource.files,
  },
});
