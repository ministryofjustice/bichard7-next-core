# @moj-bichard7/core <!-- omit from toc -->

## Contents <!-- omit from toc -->

- [Running characterisation tests](#running-characterisation-tests)
  - [For Core](#for-core)
  - [For legacy Bichard](#for-legacy-bichard)
- [Running comparison tests](#running-comparison-tests)

## Running characterisation tests

### For Core

For Core, we can run characterisation tests for all phases using:

```bash
npm run test:characterisation -w packages/core
```

### For legacy Bichard

For legacy Bichard, we can only run characterisation tests for a single phase. This is to only enable the phase we're
targeting to make sure we're testing the phase we expect.

> ⚠️ **Warning:** When changing the phase for characterisation tests you're running, you must rerun legacy Bichard for
> the corresponding phase.

1. Run the infrastructure required for legacy Bichard in Docker:

```bash
# For Phase 1:
npm run bichard-legacy:phase-1

# For Phase 2:
npm run bichard-legacy:phase-2

# For Phase 3:
npm run bichard-legacy:phase-3
```

2. Run the characterisation tests for legacy Bichard:

```bash
# For Phase 1:
npm run test:characterisation:bichard:phase1 -w packages/core

# For Phase 2:
npm run test:characterisation:bichard:phase2 -w packages/core

# For Phase 3:
npm run test:characterisation:bichard:phase3 -w packages/core
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
