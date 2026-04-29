import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["node_modules/", "dist/", "build/", "**/*.min.js"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["warn", "single", { "avoidEscape": true, "allowTemplateLiterals": true }],
      "camelcase": ["warn", { "properties": "never", "ignoreDestructuring": true }],
      "max-lines-per-function": ["warn", { "max": 100, "skipBlankLines": true, "skipComments": true }],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "no-var": "error",
      "prefer-const": "warn",
      "no-eval": "error",
      "strict": ["error", "global"],
      "no-implicit-globals": "error",
      "radix": "error",
      "no-redeclare": "error",
      "no-use-before-define": ["error", { "functions": false, "classes": true, "variables": true }],
      "no-console": "off",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "brace-style": ["error", "1tbs"],
      "indent": ["warn", 2, { "SwitchCase": 1 }],
      "no-trailing-spaces": "warn",
      "eol-last": ["warn", "always"],
      "comma-dangle": ["warn", "always-multiline"],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      "space-before-blocks": "warn",
      "keyword-spacing": "warn",
      "space-infix-ops": "warn",
      "no-multiple-empty-lines": ["warn", { "max": 2, "maxEOF": 1 }]
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
      }
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn"
    }
  }
];
