const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Workaround for Windows ENOENT error with node: built-ins (like node:sea)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('node:')) {
    return {
      type: 'empty', // mock built-in node modules to prevent Expo Metro from crashing on Windows
    };
  }
  // Optionally, chain to the standard Metro resolver.
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
