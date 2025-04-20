'use strict'

const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");
const miniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: [
        './src/js/main.js',
        './src/scss/styles.scss',
    ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        port: 8080,
        hot: true
    },
    plugins: [
        new miniCssExtractPlugin({
            filename: 'css/style.css',
        }),
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/img", to: "img"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "js"},
                {from: "./node_modules/@popperjs/core/dist/umd/popper.min.js", to: "js"},
                {from: "./node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css", to: "css"},
                {from: "./node_modules/@eonasdan/tempus-dominus/dist/js/tempus-dominus.min.js", to: "js"},
                // {from: "./node_modules/chart.js/auto/auto.js", to: "js"},
                // {from: "./node_modules/chart.js/dist/controllers/controller.pie.d.ts", to: "ts"},
                // {from: "./node_modules/chart.js/dist/elements/element.arc.d.ts", to: "ts"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use: [
                    {
                        // loader: 'style-loader'
                        loader: miniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                quietDeps: true
                            }
                        }
                    }
                ]
            }
        ]
    }
}


// const CopyPlugin = require("copy-webpack-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// // const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const path = require('path')
//
// module.exports = {
//     entry: './src/js/main.js',
//     plugins: [
//         // new MiniCssExtractPlugin({
//         //     filename: "css/[name].css",
//         // }),
//         new HtmlWebpackPlugin({
//             template: './index.html',
//         }),
//         new CopyPlugin({
//             patterns: [
//                 {from: "./src/templates", to: "templates"},
//                 {from: "./src/static/img", to: "img"},
//             ],
//         }),
//
//     ],
//     output: {
//         filename: 'main.js',
//         path: path.resolve(__dirname, 'dist'),
//     },
//     devServer: {
//         static: path.resolve(__dirname, 'dist'),
//         port: 8080,
//         hot: true
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(scss)$/,
//                 use: [
//                     // {
//                     //     loader: MiniCssExtractPlugin.loader,
//                     // },
//
//                     // for js
//                     {
//                       loader: 'style-loader',
//                     },
//                     //
//
//                     {
//                         loader: 'css-loader',
//                     },
//                     {
//                         loader: 'postcss-loader',
//                         // for js
//                         options: {
//                             postcssOptions: {
//                                 plugins: () => require('autoprefixer'),
//                             }
//                         }
//                         //
//                     },
//                     {
//                         loader: 'sass-loader',
//                         options: {
//                             sassOptions: {
//                                 quietDeps: true
//                             }
//                         }
//                     },
//                 ],
//             }
//         ]
//     },
//
// }