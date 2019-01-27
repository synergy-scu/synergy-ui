module.exports = {
    'arrow-body-style': ['error', 'as-needed', {
        'requireReturnForObjectLiteral': true,
    }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error'],
    'constructor-super': ['error'],
    'generator-star-spacing': ['error'],
    'no-class-assign': ['error'],
    //'no-confusing-arrow': ['error', {'allowParens': true}],
    'no-const-assign': ['error'],
    'no-dupe-class-members': ['error'],
    'no-new-symbol': ['error'],
    'no-restricted-imports': ['error'],
    'no-this-before-super': ['error'],
    'no-useless-computed-key': ['error'],
    'no-useless-constructor': 'off',
    'no-var': ['error'],
    'object-shorthand': ['error'],

    // might want to investigate these 2 rules a bit
    'prefer-const': ['error'],
    'prefer-destructuring': 'off',

    'prefer-numeric-literals': ['error'],
    'prefer-rest-params': ['error'],
    'prefer-spread': ['error'],
    'prefer-template': ['error'],
    'require-yield': 'off',
    'rest-spread-spacing': ['error', 'never'],
    'symbol-description': ['error'],
    'template-curly-spacing': ['error'],
    'yield-star-spacing': ['error'],
};
