// vite.config.js
// https://cn.vitejs.dev/config/
/**
 * @type {import('vite').UserConfig}
 */

import path from 'path';
import {loadEnv, UserConfigFn, UserConfig} from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import tsconfigPaths from 'vite-tsconfig-paths';
import legacy from '@vitejs/plugin-legacy';
import proxy from './config/proxy'

const resolve = (...p: any[]) => path.resolve(__dirname, ...p);
const CDN_URL = 'cdn.xiaozaoqimeng.com';

let publicPath = '';
const config: UserConfigFn = ({mode, command}): UserConfig => {
    if (command === 'build') {
        // 构建时
        const start = Date.now();
        process.on('exit', () => {
            const end = Date.now();
            console.log('本次运行时长：', ((end - start) / 1000) + 's');
        });
    }
    const env = loadEnv(mode, process.cwd(), '');
    const isProd = 'production' === env.VUE_APP_MODE;
    const BASE_URL = JSON.stringify(env.BASE_URL);

    switch (mode) {
        case 'development':
            publicPath = './';
            break;
        case 'dev':
            publicPath = `//${CDN_URL}/dev-xiaozao-read-cms/`;
            break;
        case 'test':
            publicPath = `//${CDN_URL}/test-xiaozao-read-cms/`;
            break;
        default:
            publicPath = '//cdn-xiaozao.gsxcdn.com/prod-xiaozao-read-cms/';
            break;
    }
    return {
        root: '.',
        base: '/',
        mode,
        define: {
            // 定义全局变量，会挂在 globalThis 上，浏览器环境就是window
            BASE_URL: BASE_URL,
            __PROD__: isProd,
        },
        cacheDir: './.vite',
        plugins: [
            // reactPlugin,
            reactRefresh(),
            tsconfigPaths(),
            legacy({
                targets: ['defaults', 'not IE 11'],
                polyfills: ['es.promise.finally', 'es/map', 'es/set'],
                modernPolyfills: ['es.promise.finally'],
                renderLegacyChunks: false
            })
        ],
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        css: {
            preprocessorOptions: {
                less: {
                    // additionalData: '@import "@/sass/common.scss";',
                }
            }
        },
        clearScreen: false,
        server: {
            open: true,
            port: 4000,
            // @ts-ignore
            proxy,
        },
        build: {
            target: 'es2015',
            outDir: 'output-vite',
            rollupOptions: {

            },
            commonjsOptions: {
            },
            cssCodeSplit: true,
            manifest: false,
            minify: 'terser',
            terserOptions: {
                ecma: 5,
                parse: {},
                compress: {
                    drop_console: isProd,
                    drop_debugger: isProd,
                    pure_funcs: ['console.log'],
                },
            }
        }
    };
};
export default config;
