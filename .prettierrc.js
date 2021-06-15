module.exports = {
	singleQuote: true,
	trailingComma: 'es5',
	endOfLine: 'auto',
	printWidth: 100, // the only way to set multiline/newline style
	overrides: [
	  {
		files: ['*.json', '*.md'],
		singleQuote: false,
		options: {
		  printWidth: 180
		}
	  }
	]
  };
  
