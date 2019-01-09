module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    browsers: [
                        '>0.25%',
                        'not ie 11',
                        'not op_mini all',
                    ],
                },
                forceAllTransforms: true,
            },
        ],
        '@babel/preset-react',
    ],
    plugins: [
        'dynamic-import-node',
        'import-graphql',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-json-strings',
        [
            '@babel/plugin-proposal-decorators',
            {
                legacy: true,
            },
        ],
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-logical-assignment-operators',
        '@babel/plugin-proposal-optional-chaining',
        [
            '@babel/plugin-proposal-pipeline-operator',
            {
                proposal: 'minimal',
            },
        ],
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-do-expressions',
        '@babel/plugin-proposal-function-bind',
    ],
    ignore: ['node_modules'],
};
