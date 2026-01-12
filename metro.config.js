const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { resolver } = config;

config.resolver = {
    ...resolver,
    assetExts: [...resolver.assetExts, 'wasm'],
    sourceExts: [...resolver.sourceExts.filter((ext) => ext !== 'wasm')],
};

module.exports = config;
