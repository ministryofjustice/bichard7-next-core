import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncQueryResult } from "../../types/PncQueryResult"
import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import { PncApiError } from "../../lib/PncGateway"

export default class MockPncGateway implements PncGatewayInterface {
  updates: PncUpdateRequest[] = []
  result: (PncQueryResult | PncApiError | undefined)[] = []

  constructor(
    result: PncQueryResult | (PncQueryResult | PncApiError)[] | PncApiError | undefined,
    public queryTime: Date | undefined = undefined
  ) {
    if (Array.isArray(result)) {
      this.result = result
    } else {
      this.result.push(result)
    }
  }

  private getNextResult() {
    return this.result.shift()
  }

  query(_: string): Promise<PncQueryResult | PncApiError | undefined> {
    return Promise.resolve(this.getNextResult())
  }

  update(request: PncUpdateRequest, _correlationId: string): Promise<void | PncApiError> {
    this.updates.push(request)

    const nextResult = this.getNextResult()
    if (nextResult instanceof PncApiError) {
      return Promise.resolve(nextResult)
    }

    return Promise.resolve()
  }
}
