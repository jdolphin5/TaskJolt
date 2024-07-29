const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // entry point of React app
  output: {
    path: path.resolve(__dirname, "dist"), // path_of_current_dir/output_dir
    filename: "bundle.js",
    publicPath: "/", //set path of file-loader
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "url-loader",
        options: {
          name: "images/[name].[hash].[ext]",
          limit: 8192,
        },
      },
    ],
  },
  /*
  plugins: [
    new HtmlWebpackPlugin({
      template: './new/path/to/index.html', // Specify the new location of your HTML template
    }),
  */
  devServer: {
    historyApiFallback: true,
  },
  cache: false,
};
