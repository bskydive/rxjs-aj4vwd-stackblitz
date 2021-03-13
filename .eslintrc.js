module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": "standard",
	"globals": {
		"Atomics": "readonly",
		"SharedArrayBuffer": "readonly"
	},
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": 2018,
		"sourceType": "module"
	},
	"rules": {
		"linebreak-style": ["warn", "unix"],
		"quotes": ["warn", "single"],
		"padded-blocks": "off",
		"space-before-blocks": "warn",
		"no-multi-spaces": "warn",
		"space-before-function-paren": "off",
		"import/no-duplicates": "warn", // весь импорт из одного файла в одной строке
		// стиль
		"no-console": "warn",
		"eqeqeq": "warn", // ===
		"no-shadow": "error", // https://eslint.org/docs/rules/no-shadow
		"no-multi-assign": "error", // https://eslint.org/docs/rules/no-multi-assign
		"no-confusing-arrow": "warn", // https://eslint.org/docs/rules/no-confusing-arrow
		// дублирует tslint
		"no-cond-assign": "error",
		"block-spacing": "warn",
		"trailing-comma": "off",
		"object-curly-spacing": "warn",
		// глючит
		"object-curly-even-spacing": "off",
		"indent": "off",
		"semi": "off",
		"no-tabs": "off",
		"no-undef": "off", // не понимает angular modules
		"no-unused-vars": "off",
		"no-multiple-empty-lines": "off",
		"spaced-comment": "off",
		"no-trailing-spaces": "off",
		"comma-dangle": "off",
		"no-useless-constructor": "off",
		'handle-callback-err': 'off',
		"no-dupe-args": 'error',
		"no-dupe-class-members": 'error',
		"no-dupe-keys": 'error',
		'lines-between-class-members': 'warn',
		'eol-last': 'warn',
		'comma-spacing': 'warn',
		'prefer-const': 'warn',
		'arrow-spacing': 'warn',
		'key-spacing': 'warn',
		'space-in-parens': 'warn',
		'eol-last':'warn',
		'space-infix-ops': 'warn',
	}
};