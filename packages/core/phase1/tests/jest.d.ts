/// <reference types="jest" />

declare namespace jest {
  interface It {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ifNewBichard: (...args: any[]) => void
  }
}
