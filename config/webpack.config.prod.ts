import merge from 'webpack-merge'
import base from './webpack.config'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import AddAssetHtmlWebpackPlugin from 'add-asset-html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import paths from './paths'
import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import os from 'os'

const workers = os.cpus().length
const resolve = (...p: string[]): string => path.resolve(__dirname, ...p)

function dllPlugin(): webpack.WebpackPluginInstance[] {
  const plugins: (
    | ((this: webpack.Compiler, compiler: webpack.Compiler) => void)
    | webpack.WebpackPluginInstance
  )[] = [
    // 代码包分析插件
    // new BundleAnalyzerPlugin()
  ]

  const files = fs.readdirSync(paths.dll)
  files.forEach((file) => {
    if (/.*.dll.js/.test(file)) {
      plugins.push(
        new AddAssetHtmlWebpackPlugin({
          filepath: resolve(paths.dll, file),
          outputPath: 'static/dll',
          publicPath: paths.publicUrlOrPath + 'static/dll',
        })
      )
    } else if (/.*.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: resolve(paths.dll, file),
          context: paths.appBuild,
        })
      )
    }
  })
  return plugins
}

export default merge(base, {
  mode: 'production',
  optimization: {
    usedExports: true, //tree-shaking
    concatenateModules: false,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: workers,
        terserOptions: {
          ecma: undefined,
          keep_fnames: false,
          parse: {},
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log'],
          },
        },
      }),
    ],
  },
  devtool: false,
  plugins: [
    ...dllPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      title: 'React',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
  ],
})
