# @moj-bichard7/core

## Contents<!-- omit from toc -->

- [Running characterisation tests](#running-characterisation-tests)
  - [For Core](#for-core)
  - [For legacy Bichard](#for-legacy-bichard)

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
