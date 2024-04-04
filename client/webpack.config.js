const path = require("path");

module.exports = {
  entry: "./src/index.tsx", // entry point of React app
  output: {
    path: path.resolve(__dirname, "dist"), // path_of_current_dir/output_dir
    filename: "bundle.js",
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
    ],
  },
  /*
  plugins: [
    new HtmlWebpackPlugin({
      template: './new/path/to/index.html', // Specify the new location of your HTML template
    }),
  */
  cache: false,
};
