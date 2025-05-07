import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncQueryResult } from "../../types/PncQueryResult"

import { PncApiError } from "../../lib/pnc/PncGateway"

export default class MockPncGateway implements PncGatewayInterface {
  result: (PncApiError | PncQueryResult | undefined)[] = []
  updates: PncUpdateRequest[] = []

  constructor(
    result: (PncApiError | PncQueryResult | undefined)[] | PncApiError | PncQueryResult | undefined,
    public queryTime: Date | undefined = undefined
  ) {
    if (Array.isArray(result)) {
      this.result = result
    } else {
      this.result.push(result)
    }
  }

  query(_: string): Promise<PncApiError | PncQueryResult | undefined> {
    return Promise.resolve(this.getNextResult())
  }

  update(request: PncUpdateRequest, _correlationId: string): Promise<PncApiError | void> {
    this.updates.push(request)

    const nextResult = this.getNextResult()
    if (nextResult instanceof PncApiError) {
      return Promise.resolve(nextResult)
    }

    return Promise.resolve()
  }

  private getNextResult() {
    return this.result.shift()
  }
}
