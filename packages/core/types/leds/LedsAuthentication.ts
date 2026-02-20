import type { PromiseResult } from "@moj-bichard7/common/types/Result"

export default abstract class LedsAuthentication {
  protected constructor() {}

  generateBearerToken(): PromiseResult<string> {
    throw Error("Not supported")
  }
}
