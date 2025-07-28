# @moj-bichard7/core <!-- omit from toc -->

## Contents <!-- omit from toc -->

- [Running characterisation tests](#running-characterisation-tests)
- [Running comparison tests](#running-comparison-tests)

## Running characterisation tests

We can run characterisation tests for all phases using:

```bash
npm run test:characterisation -w packages/core
```

## Running comparison tests

We have comparison tests for each phase of Bichard's message processing to make
sure we've replicated the same behaviour as legacy Bichard in Core.

These tests use comparison files (JSON) which include the input message and the
output message from legacy Bichard for a phase. They may also include the
triggers and audit log events generated as well as the before and after states
for the database. We generated comparison files from our E2E tests and they live
within the `tests/fixtures/e2e-comparison` folder for each phase.

Using a comparison file, a comparison test runs a phase of Core with the
input message and checks that the output from Core (the actual) matches the
output from legacy Bichard (the expected).

From the root of the repository:

1. Spin up the PostgreSQL database by running the following.

```bash
npm run postgres
```

2. Run the comparison tests for a phase.

```bash
# For Phase 1:
npm run test:compare:phase1 -w packages/core

# For Phase 2:
npm run test:compare:phase2 -w packages/core

# For Phase 3:
npm run test:compare:phase3 -w packages/core
```
