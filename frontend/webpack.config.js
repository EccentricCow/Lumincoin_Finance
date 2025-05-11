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
        './src/scss/styles.scss',
        './src/scripts/main.ts',
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
                {from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "scripts"},
                {from: "./node_modules/@popperjs/core/dist/umd/popper.min.js", to: "scripts"},
                {from: "./node_modules/@eonasdan/tempus-dominus/dist/css/tempus-dominus.min.css", to: "css"},
                {from: "./node_modules/@eonasdan/tempus-dominus/dist/js/tempus-dominus.min.js", to: "scripts"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(scss|sass|css)$/,
                use: [
                    {
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
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};