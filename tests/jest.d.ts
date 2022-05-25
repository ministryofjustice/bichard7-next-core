/// <reference types="jest" />

declare namespace jest {
  interface It {
    ifNewBichard: (...args: any[]) => void
  }
}
