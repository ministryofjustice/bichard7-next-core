import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import type PncUpdateRequest from "../../phase3/types/PncUpdateRequest"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncQueryResult } from "../../types/PncQueryResult"

import { PncApiError } from "../../lib/PncGateway"

export default class MockPncGateway implements PncGatewayInterface {
  updates: PncUpdateRequest[] = []

  constructor(
    private result: PncApiError | PncQueryResult | undefined,
    public queryTime: Date | undefined = undefined
  ) {}

  query(_: string): Promise<PncApiError | PncQueryResult | undefined> {
    return Promise.resolve(this.result)
  }

  update(request: PncUpdateRequest, _correlationId: string): PromiseResult<void> {
    this.updates.push(request)

    if (this.result instanceof PncApiError) {
      return Promise.resolve(this.result)
    } else {
      return Promise.resolve()
    }
  }
}
