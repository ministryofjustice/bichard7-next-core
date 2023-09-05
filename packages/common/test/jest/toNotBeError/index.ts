/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { isError, type Result } from "../../../types/Result"

declare global {
  namespace jest {
    interface Matchers<R> {
      toNotBeError(): any
    }
  }
}

expect.extend({
  toNotBeError(received: Result<any>): any {
    if (isError(received)) {
      return {
        message: () => received,
        pass: false
      }
    }

    return {
      pass: true
    }
  }
})
