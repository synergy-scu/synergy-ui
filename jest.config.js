module.exports = {
    setupFiles: [
        `<rootDir>/jest/rafShim.js`,
        `<rootDir>/jest/jestsetup.js`,
    ],
    collectCoverageFrom: [
        '(app)|(src)/**/*.js',
        '!(app)|(src)/**/index.js',
        '!**/node_modules/**',
    ],
    coverageDirectory: '<rootDir>/build_artifacts',
    coverageReporters: ['text', 'clover', 'cobertura', 'lcov'],
    resetModules: true,
    verbose: true,
    reporters: [
        'default',
        [
            'jest-junit',
            {
                'output': '<rootDir>/build_artifacts/junit.xml',
            },
        ],
    ],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg|ttf)$/': '<rootDir>/app/__mocks__/fileMock.js',
    },
};
