import fs from 'fs'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const context = path.resolve(__dirname, 'src')

const pages = fs.readdirSync(context).filter(page => page.indexOf('.') !== 0)

const entry = {}
const plugins = []
pages.forEach(page => {
    entry[page] = ['.', page, 'index.js'].join('/')

    plugins.push(new HtmlWebpackPlugin({
        filename: page + '/index.html'
    }))
})

export default {
    context: context,

    entry: entry,

    output: {
        path: path.resolve(__dirname, 'dist'),

        filename: '[name]/bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },

            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },

            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },

    devtool: 'source-map',

    plugins: plugins,

    resolve: {
   
    },

    devServer: {
        contentBase: __dirname + '/dist',
        compress: true,
        port: 9000
    }
}
