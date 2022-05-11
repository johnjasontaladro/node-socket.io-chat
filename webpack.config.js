const path = require("path");

module.exports = {
  entry: "./public/chat.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public"),
  },
  mode: "production",
};
