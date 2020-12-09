const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

let filename = "[name].[chunkhash:8].js";

if (process.env.NODE_ENV === "production") {
  filename = "js/[name].[chunkhash:8].js";
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](@vue|vue-router|vuex|axios)[\\/]/,
          name: "vendor",
          chunks: "all",
        },
        betterScroll: {
          test: /[\\/]node_modules[\\/](@better-scroll)[\\/]/,
          name: "better-scroll",
          chunks: "async",
        },
      },
    },
  },
  resolve: {
    extensions: [".js", ".vue"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  devServer: {
    port: 8000,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" },
      },
    },
  },
};
