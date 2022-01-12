module.exports = {
    transform: {
        '\\.[tj]sx?$': ['esbuild-jest', { sourcemap: 'inline' }],
    },
    setupFilesAfterEnv: ['<rootDir>/setupJest.cjs'],
    snapshotFormat: {
        printBasicPrototype: false,
    },
}
