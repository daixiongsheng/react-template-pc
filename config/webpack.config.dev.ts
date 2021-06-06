import merge from 'webpack-merge';
import base from './webpack.config';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import paths from './paths';

export default merge(base, {
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            title: 'React',
        })
    ]
});