const legacyBichard = process.env.USE_BICHARD;

test.ifNewBichard = (testDescription: string, fn?: jest.ProvidesCallback,timeout?: number) => legacyBichard ? test.skip(testDescription, fn, timeout) : test(testDescription, fn, timeout);
