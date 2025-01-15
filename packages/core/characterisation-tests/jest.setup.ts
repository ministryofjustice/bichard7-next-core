const legacyBichard = process.env.USE_BICHARD === "true"
const phase2Enabled = process.env.ENABLE_PHASE_2 === "true"
const phase3Enabled = process.env.ENABLE_PHASE_3 === "true"

jest.setTimeout(30000)

test.ifNewBichard = (testDescription: string, fn?: jest.ProvidesCallback, timeout?: number) => {
  return legacyBichard ? test.skip(testDescription, fn, timeout) : test(testDescription, fn, timeout)
}

describe.ifPhase1 = (description: string, fn: jest.EmptyFunction) => {
  return legacyBichard && (phase2Enabled || phase3Enabled) ? describe.skip(description, fn) : describe(description, fn)
}

describe.ifPhase2 = (description: string, fn: jest.EmptyFunction) => {
  return legacyBichard && (!phase2Enabled || phase3Enabled) ? describe.skip(description, fn) : describe(description, fn)
}

describe.ifPhase3 = (description: string, fn: jest.EmptyFunction) => {
  return legacyBichard && !phase3Enabled ? describe.skip(description, fn) : describe(description, fn)
}
