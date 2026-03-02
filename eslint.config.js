import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import validateFilename from "eslint-plugin-validate-filename";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Global ignores
  {
    ignores: ["dist/**", ".output/**", "**/*.css", "**/*.scss"],
  },

  // Base JavaScript configuration
  js.configs.recommended,

  // TypeScript configurations
  ...tseslint.configs.recommended,

  // Configuration for TypeScript/JavaScript files
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React Hooks rules (already present)
      ...reactHooks.configs.recommended.rules,

      // Core React rules (used by Meta/Facebook)
      ...react.configs.recommended.rules,
      "react/jsx-uses-react": "off", // Not needed with new JSX transform
      "react/react-in-jsx-scope": "off", // Not needed with new JSX transform
      "react/prop-types": "off", // Using TypeScript instead

      // JSX-specific rules (Airbnb standard)
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-closing-bracket-location": ["error", "line-aligned"],
      "react/jsx-closing-tag-location": "error",
      "react/jsx-curly-spacing": ["error", "never"],
      "react/jsx-equals-spacing": ["error", "never"],
      "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react/jsx-max-props-per-line": [
        "error",
        { maximum: 1, when: "multiline" },
      ],

      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-pascal-case": "error",
      "react/jsx-props-no-multi-spaces": "error",
      "react/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "always",
          afterOpening: "never",
          beforeClosing: "never",
        },
      ],
      "react/jsx-wrap-multilines": [
        "error",
        {
          declaration: "parens-new-line",
          assignment: "parens-new-line",
          arrow: "parens-new-line",
          condition: "parens-new-line",
          logical: "parens-new-line",
          prop: "parens-new-line",
        },
      ],

      // React component rules (industry best practices)
      "react/button-has-type": "error",
      "react/default-props-match-prop-types": "error",
      "react/destructuring-assignment": ["error", "always"],
      "react/display-name": "error",
      "react/forbid-component-props": ["error", { forbid: ["style"] }],
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "react/no-access-state-in-setstate": "error",
      "react/no-array-index-key": "warn",
      "react/no-children-prop": "error",
      "react/no-danger": "warn",
      "react/no-deprecated": "error",
      "react/no-did-update-set-state": "error",
      "react/no-find-dom-node": "error",
      "react/no-is-mounted": "error",
      "react/no-multi-comp": ["error", { ignoreStateless: true }],
      "react/no-redundant-should-component-update": "error",
      "react/no-render-return-value": "error",
      "react/no-string-refs": "error",
      "react/no-this-in-sfc": "error",
      "react/no-typos": "error",
      "react/no-unescaped-entities": "error",
      "react/no-unknown-property": "error",
      "react/no-unused-prop-types": "error",
      "react/no-unused-state": "error",
      "react/prefer-es6-class": ["error", "always"],
      "react/prefer-stateless-function": [
        "error",
        { ignorePureComponents: true },
      ],
      "react/require-render-return": "error",
      "react/self-closing-comp": "error",
      "react/sort-comp": [
        "error",
        {
          order: [
            "static-variables",
            "static-methods",
            "instance-variables",
            "lifecycle",
            "/^handle.+$/",
            "/^on.+$/",
            "getters",
            "setters",
            "/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/",
            "instance-methods",
            "everything-else",
            "rendering",
          ],
          groups: {
            lifecycle: [
              "displayName",
              "propTypes",
              "contextTypes",
              "childContextTypes",
              "mixins",
              "statics",
              "defaultProps",
              "constructor",
              "getDefaultProps",
              "getInitialState",
              "state",
              "getChildContext",
              "getDerivedStateFromProps",
              "componentWillMount",
              "UNSAFE_componentWillMount",
              "componentDidMount",
              "componentWillReceiveProps",
              "UNSAFE_componentWillReceiveProps",
              "shouldComponentUpdate",
              "componentWillUpdate",
              "UNSAFE_componentWillUpdate",
              "getSnapshotBeforeUpdate",
              "componentDidUpdate",
              "componentDidCatch",
              "componentWillUnmount",
            ],
            rendering: ["/^render.+$/", "render"],
          },
        },
      ],

      // React Hooks rules (already present but ensuring they're comprehensive)
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Other existing rules
      "no-console": "error",
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: ["*"],
        },
      ],
      // Allow unused vars with underscore prefix
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      // Import sorting rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js built-in modules
            "external", // External packages
            "internal", // Internal modules (your app)
            "parent", // Parent directory imports
            "sibling", // Same directory imports
            "index", // Index imports
            "object", // Object imports
            "type", // Type imports
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
            },
            {
              pattern: "../**",
              group: "parent",
            },
            {
              pattern: "./**",
              group: "sibling",
            },
            {
              pattern: "**/*.{css,scss,sass}",
              group: "object",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      // Require blank lines between statements for better readability
      "padding-line-between-statements": [
        "error",
        // Require blank line after variable declarations
        { blankLine: "always", prev: ["const", "let", "var"], next: "*" },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },

        // Require blank line after function declarations
        { blankLine: "always", prev: "function", next: "*" },

        // Require blank line before return statements
        { blankLine: "always", prev: "*", next: "return" },

        // Require blank line after blocks
        { blankLine: "always", prev: "block-like", next: "*" },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    ignores: ["**/vite-env.d.ts"],
    plugins: {
      "validate-filename": validateFilename,
    },
    rules: {
      "validate-filename/naming-rules": [
        "warn",
        {
          rules: [
            {
              case: "kebab",
              target: "**/*.{js,ts,tsx}",
            },
          ],
        },
      ],
    },
  },

  // Specific rules for index files
  {
    files: ["**/index.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
];
