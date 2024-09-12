cucumberjs currently loads files in this folder using the `--require steps` CLI option configured in `package.json`.
Documentation: [--require](https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md#finding-your-code)

As part of refactoring old tests to work with the new UI, we've split the entry point
to enable us to refactor into entirely new implementations, given that the old implementations
won't need to exist once we decommission old bichard.

Starting in `./index.js`, it should be reasonably easy to follow the code through.
