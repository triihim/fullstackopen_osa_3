module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    "standard"
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    indent: [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    quotes: [
      "error",
      "double"
    ],
    semi: [
      "error",
      "always"
    ]
  }
};
