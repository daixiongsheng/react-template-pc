/* eslint-disable */

const path = require('path')
const { execSync } = require('child_process')
const webpack = require('webpack')

const dllPath = path.join(__dirname, '../', 'dll')

execSync(`rm -rf ${dllPath}`)

function createConfig(config) {
  return {
    mode: 'production',
    entry: config.entry
      ? { ...config.entry }
      : {
          [config.name]: config.libs,
        },
    output: {
      // 打包后文件输出的位置
      path: dllPath,
      // vendor.dll.js中暴露出的全局变量名。
      filename: '[name].[hash:8].dll.js',
      // 打包出的是一个库，暴漏到全局,名叫vendors
      library: '[name]',
    },
    // devtool: 'source-map',
    plugins: [
      new webpack.DllPlugin({
        name: '[name]',
        path: path.resolve(dllPath, '[name].manifest.json'),
      }),
      config.ref
        ? new webpack.DllReferencePlugin({
            manifest: path.resolve(dllPath, `${config.ref}.manifest.json`),
          })
        : '',
    ].filter(Boolean),
  }
}

async function runWebpack(config) {
  config = Array.isArray(config) ? config : [config]
  for (const c of config) {
    await build(c)
    console.log(`build ${Object.keys(c.entry)[0]}.dll success`)
  }
}

function build(config) {
  return new Promise((resolve) => {
    webpack(config, (err, stats) => {
      if (err) {
        throw err
      }
      resolve()
    })
  })
}

runWebpack(
  createConfig({
    entry: {
      vendors: ['react', 'react-dom'],
    },
  })
)
