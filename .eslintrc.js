module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  overrides: [
    {
      files: ["{lib,bin}/**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      env: {
        es6: true,
        node: true,
      },
    },
    {
      files: ["src/**/*.ts"],
      extends: [
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./src/tsconfig.json",
      },
      env: {
        es2022: true,
        node: true,
      },
    },
    {
      files: ["**/*.js"],
      extends: ["prettier"],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "script",
      },
      env: {
        es6: true,
        node: true,
      },
    },
  ],
};
