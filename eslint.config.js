module.exports = [
  {
    // Applies to all files by default
    // Or specify files to target, e.g., 'src/**/*.js'
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022, // Or a later version supported by your Node.js environment
      sourceType: "commonjs",
      globals: {
        // Add any global variables specific to your CommonJS environment
        // e.g., 'module': 'readonly', 'require': 'readonly' if not implicitly handled by 'commonjs' sourceType
      },
    },
    rules: {
      // Add your desired ESLint rules here
      indent: ["error", 2],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "no-unused-vars": ["warn", { args: "none" }],
      // ... more rules
    },
    // Extend recommended configurations
    extends: [
      "eslint:recommended",
      // Add other shareable configs or plugins if needed,
      // e.g., for specific frameworks or libraries like 'plugin:node/recommended'
    ],
    // Add plugins if necessary
    plugins: {
      // e.g., node: require('eslint-plugin-node')
    },
  },
];
