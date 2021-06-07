import modules from './modules'
import path from 'path'
import paths from './paths'
import webpack from 'webpack'
import proxy from './proxy'

const __DEV__ = process.env.NODE_ENV === 'development'
if (!__DEV__) {
  process.env.NODE_ENV = 'production'
}
const isEnvProduction = !__DEV__

const start = Date.now()
process.on('exit', () => {
  const end = Date.now()
  console.log('本次运行时长：', (end - start) / 1000 + 's')
})

const config: webpack.Configuration = {
  target: 'web',
  mode: 'development',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:8088`,
    'webpack/hot/only-dev-server',
    path.resolve(paths.appSrc, 'index.tsx'),
  ],
  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[hash:8].js',
    chunkFilename: 'static/js/[name].[hash:8].chunk.js',
    publicPath: paths.publicUrlOrPath,
  },
  devtool: 'cheap-module-source-map',
  plugins: [],
  // @ts-ignore
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 8088,
    hot: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy,
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules].concat(
      modules.additionalModulePaths || []
    ),
    extensions: paths.moduleFileExtensions.map((ext) => `.${ext}`),
    alias: {
      ...(modules.webpackAliases || {}),
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          limit: 1024 * 4,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          customize: require.resolve(
            'babel-preset-react-app/webpack-overrides'
          ),
          presets: [[require.resolve('babel-preset-react-app')]],

          plugins: [
            [
              require.resolve('babel-plugin-named-asset-import'),
              {
                loaderMap: {
                  svg: {
                    ReactComponent:
                      '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                  },
                },
              },
            ],
          ].filter(Boolean),
          cacheDirectory: true,
          cacheCompression: false,
          compact: isEnvProduction,
        },
      },
    ],
  },
}

export default config
