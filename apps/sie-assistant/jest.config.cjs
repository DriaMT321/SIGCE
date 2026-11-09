module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        module: 'CommonJS',
        moduleResolution: 'node',
        target: 'ES2022',
        esModuleInterop: true,
        verbatimModuleSyntax: false,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      },
    }],
  },
};
