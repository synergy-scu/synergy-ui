module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
        },
    },
    plugins: [
        'react',
        'jest',
    ],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jest/recommended',
    ],
    env: {
        es6: true,
        node: true,
        jest: true,
        'jest/globals': true,
        browser: true, 
    },
    globals: {
        // Enzyme
        mount: true,
        shallow: true,
        render: true,

        // Browser
        document: true,
        fetch: true,
        window: true,
    },
    rules: {
        ...require('./eslint/bestPractices'),
        ...require('./eslint/errors'),
        ...require('./eslint/es6'),
        ...require('./eslint/node'),
        ...require('./eslint/style'),
        ...require('./eslint/variables'),
        'valid-jsdoc': 'off',
        'no-console': 'off',
        'prefer-promise-reject-errors': 'off',

        // Becasue we are using class transform properties
        'no-invalid-this': 'off',
        'babel/no-invalid-this': 'off',
    },
    settings: {
        react: {
            version: '16.7',
        },
    },
};
