module.exports = {
  "root": true,
  "plugins": [
    "@typescript-eslint",
    "svelte3"
  ],
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "extends": [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "ignorePatterns": [
    "*.config.*",
    "node_modules",
    "dist",
    "target"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module",
    "project": [
      "tsconfig.json"
    ]
  },
  "overrides": [
    {
      "files": [
        "**/*.svelte"
      ],
      "processor": "svelte3/svelte3"
    }
  ],
  "rules": {
    // indent rule
    "@typescript-eslint/indent": [
      "error",
      2
    ],
    // prefix for interfaces
    "@typescript-eslint/interface-name-prefix": [
      "warn",
      {
        "prefixWithI": "always"
      }
    ],
    // member delimeter (multiline and singleline)
    "@typescript-eslint/member-delimiter-style": [
      "warn",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "comma",
          "requireLast": false
        }
      }
    ],
    // array declaration type - Array<T>
    "@typescript-eslint/array-type": [
      "warn",
      {
        "default": "array-simple"
      }
    ],
    // disable camelcase
    "camelcase": "off",
    "@typescript-eslint/camelcase": [
      "off"
    ],
    // specify type in "default" values
    "@typescript-eslint/no-inferrable-types": [
      "error",
      {
        "ignoreParameters": true
      }
    ],
    // double quotes with escape
    "quotes": "off",
    "@typescript-eslint/quotes": [
      "error",
      "double",
      {
        "avoidEscape": true
      }
    ],
    // semicolon usage
    "semi": "off",
    "@typescript-eslint/semi": [
      "error",
      "always"
    ],
    // unused vars
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "^_$",
        "argsIgnorePattern": "^_$"
      }
    ],
    // return Promise<void> and void
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        "checksVoidReturn": false
      }
    ],
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    // other options
    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/unified-signatures": "error",
    "comma-dangle": "off",
    "complexity": "off",
    "constructor-super": "error",
    "dot-notation": "error",
    "eqeqeq": [
      "error",
      "smart"
    ],
    "guard-for-in": "error",
    "id-blacklist": "off",
    "id-match": "off",
    "max-classes-per-file": [
      "error",
      1
    ],
    "max-len": "off",
    "new-parens": "error",
    "no-bitwise": "error",
    "no-caller": "error",
    "no-cond-assign": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-fallthrough": "off",
    "no-invalid-this": "off",
    "no-new-wrappers": "error",
    "no-shadow": [
      "error",
      {
        "hoist": "all"
      }
    ],
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-underscore-dangle": "off",
    "no-unsafe-finally": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    "object-shorthand": "error",
    "one-var": [
      "error",
      "never"
    ],
    "radix": "error",
    "spaced-comment": "error",
    "use-isnan": "error",
    "valid-typeof": "off"
  },
  "settings": {}
};