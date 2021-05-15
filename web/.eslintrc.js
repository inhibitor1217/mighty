module.exports = {
  env: {
    node: true,
    jest: true,
  },
  extends: "@mighty/eslint-config",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
        "newlines-between": "always",
      },
    ],
    "no-restricted-imports": ["error", { paths: ["src"], patterns: ["../*"] }],
    "no-restricted-modules": ["error", { paths: ["src"], patterns: ["../*"] }],
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
