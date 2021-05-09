module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: "@mighty/eslint-config",
  parserOptions: {
    project: "./tsconfig.json",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
