const path = require("path")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

module.exports = {
  entry: {
    compare: "./src/comparison/compareLambda.ts",
    rerunComparison: "./src/comparison/rerunComparisonLambda.ts"
  },
  resolve: {
    modules: [path.resolve("./node_modules"), path.resolve("."), path.resolve(".")],
    extensions: [".js", ".json", ".ts"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "..", "build"),
    filename: "[name].js"
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    node: "14"
                  }
                }
              ],
              ["@babel/preset-typescript"]
            ]
          }
        }
      }
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin()]
}
