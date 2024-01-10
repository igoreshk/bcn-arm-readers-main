module.exports = {
  singleQuote: true,
  tabWidth: 2,
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 120,
  overrides: [
    {
      files: '*.scss',
      options: {
        singleQuote: false
      }
    }
  ],
  quoteProps: 'preserve',
  trailingComma: 'none'
};
