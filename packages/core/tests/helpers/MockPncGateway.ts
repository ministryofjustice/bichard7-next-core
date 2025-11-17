import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"

import type PoliceUpdateRequest from "../../phase3/types/PoliceUpdateRequest"
import type PoliceGateway from "../../types/PoliceGateway"

import PoliceApiError from "../../lib/policeGateway/PoliceApiError"

export default class MockPncGateway implements PoliceGateway {
  result: (PoliceApiError | PoliceQueryResult | undefined)[] = []
  updates: PoliceUpdateRequest[] = []

  constructor(
    result: (PoliceApiError | PoliceQueryResult | undefined)[] | PoliceApiError | PoliceQueryResult | undefined,
    public queryTime: Date | undefined = undefined
  ) {
    if (Array.isArray(result)) {
      this.result = result
    } else {
      this.result.push(result)
    }
  }

  query(_: string): Promise<PoliceApiError | PoliceQueryResult | undefined> {
    return Promise.resolve(this.getNextResult())
  }

  update(request: PoliceUpdateRequest, _correlationId: string): Promise<PoliceApiError | void> {
    this.updates.push(request)

    const nextResult = this.getNextResult()
    if (nextResult instanceof PoliceApiError) {
      return Promise.resolve(nextResult)
    }

    return Promise.resolve()
  }

  private getNextResult() {
    return this.result.shift()
  }
}
