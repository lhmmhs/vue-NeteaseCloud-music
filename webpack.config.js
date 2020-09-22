const HtmlWebpackPlugin = require("html-webpack-plugin")
const { VueLoaderPlugin } = require("vue-loader")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const path = require("path")
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
// const UglifyJsPlugin = require("uglifyjs-webpack-plugin")

let filename = "[name].[chunkhash:8].js"

if (process.env.NODE_ENV === "production") {
  filename = "js/[name].[chunkhash:8].js"
}

module.exports = {
  output: {
    filename,
    path: __dirname + "/dist",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, "css-loader"],
      },
      {
        test: /\.stylus$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "网易云音乐",
      template: "./index.html",
    }),

    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash:8].css",
    }),

    new VueLoaderPlugin(),
  ],
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: {
    port: 8000,
  },
}
