import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'umjik',
    },
    githubUrl: 'https://github.com/haejunejung/umjik',
    links: [
      {
        text: 'Documentation',
        url: '/docs',
      },
    ],
  };
}
