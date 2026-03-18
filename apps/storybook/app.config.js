export default ({ config }) => ({
  ...config,
  name: "umjik-storybook",
  slug: "umjik-storybook",
  version: "1.0.0",
  scheme: "umjik-storybook",
  newArchEnabled: false,
  web: {
    bundler: "metro",
  },
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
  },
});
