const path = require('node:path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    alias: {
      'lodash': 'lodash-es',
    },
    configure: webpackConfig => {
      // magic fix for:
      // > BREAKING CHANGE: The request '@mui/material/Autocomplete' failed to resolve only because it was resolved as fully specified
      // See: https://stackoverflow.com/a/75109686
      webpackConfig.module.rules.unshift({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      });

      return webpackConfig;
    },
    plugins: [
      // Tree-shake unused/unnecessary Sentry code
      // See: https://docs.sentry.io/platforms/javascript/guides/react/configuration/tree-shaking/#tree-shaking-optional-code
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,

        // Currently replays are disabled, so these have no effect:
        __RRWEB_EXCLUDE_IFRAME__: true,
        __RRWEB_EXCLUDE_SHADOW_DOM__: true,
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
      }),
    ],
  },
  jest: {
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      process.env.NODE_ENV='production';
      return jestConfig;
    }
  },
};
