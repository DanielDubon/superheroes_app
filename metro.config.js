const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(
  (ext) => ext !== 'svg'
);
defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'svg'];
defaultConfig.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

module.exports = mergeConfig(defaultConfig, {
  transformer: { unstable_allowRequireContext: true },
});