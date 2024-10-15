/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="jest" />

declare namespace jest {
  interface It {
    ifNewBichard: (...args: any[]) => void
  }

  interface Describe {
    ifPhase1: (...args: any[]) => void
    ifPhase2: (...args: any[]) => void
  }
}
