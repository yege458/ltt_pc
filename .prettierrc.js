module.exports = {
  TrailingCooma: "none",
  arrowParens: "avoid",
  singleQuote: false,
  semi: true,
  trailingComma: "none",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  vueIndentScriptAndStyle: true,
  quoteProps: "as-needed",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  jsxSingleQuote: false,
  insertPragma: false,
  requirePragma: false,
  proseWrap: "never",
  htmlWhitespaceSensitivity: "strict",
  endOfLine: "auto",
  rangeStart: 0,
  overrides: [
    {
      files: "*.md",
      options: {
        tabWidth: 2
      }
    }
  ]
};
