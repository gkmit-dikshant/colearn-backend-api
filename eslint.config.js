module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        // Add any global variables specific to your CommonJS environment
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
    ],
    // Add plugins if necessary
    plugins: {
      // e.g., node: require('eslint-plugin-node')
    },
  },
];
