import javascript from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
  { ignores: ["dist/", "node_modules/", ".firebase/"] },
  javascript.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
  },
  {
    files: ["*.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    rules: {
      // No one-letter names: every variable, parameter and function says what it holds.
      "id-length": ["error", { min: 2, properties: "never" }],
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-unused-vars": ["error", { args: "after-used" }],
      "no-implicit-coercion": "error",
      curly: ["error", "multi-line"],
    },
  },
  prettierConfig,
];
