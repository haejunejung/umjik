const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const defaultConfig = getDefaultConfig(projectRoot);

// Support monorepo - watch all files in the monorepo
defaultConfig.watchFolders = [monorepoRoot];

// Resolve packages from monorepo root
defaultConfig.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Enable require.context for story discovery
defaultConfig.transformer = {
  ...defaultConfig.transformer,
  unstable_allowRequireContext: true,
};

module.exports = withStorybook(defaultConfig, {
  enabled: true,
  configPath: path.resolve(projectRoot, './.storybook'),
  useJs: true,
});
