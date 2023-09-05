/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
export {}

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeBetween(min: T, max: T): any
    }
  }
}

expect.extend({
  toBeBetween(received: Date | number, min: Date | number, max: Date | number): any {
    const pass = received >= min && received <= max
    return {
      message: () => `expected ${received} to be between ${min} and ${max}`,
      pass
    }
  }
})
