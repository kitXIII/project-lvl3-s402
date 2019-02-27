import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const mode = process.env.NODE_ENV || 'development';
const isNotProdMode = mode !== 'production';

export default {
  entry: {
    bootstrap: [
      './node_modules/bootstrap/dist/js/bootstrap.js',
      './node_modules/bootstrap/dist/css/bootstrap.min.css',
    ],
    fontawesome: [
      './node_modules/@fortawesome/fontawesome-free/js/all.js',
      '@fortawesome/fontawesome-free/css/all.min.css',
    ],
    index: './src/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.min\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/',
          },
        }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/template.html',
    }),
    new CopyPlugin([{
      from: 'src/img/favicon.ico',
    }]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
    }),
  ],
  devtool: isNotProdMode && 'eval-sourcemap',
  mode,
};
