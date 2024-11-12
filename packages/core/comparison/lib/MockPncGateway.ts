import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { PncUpdateRequest } from "../../phase3/types/PncUpdateRequestGenerator"
import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncOperation } from "../../types/PncOperation"
import type { PncQueryResult } from "../../types/PncQueryResult"

export default class MockPncGateway implements PncGatewayInterface {
  constructor(
    private result: PncQueryResult | Error | undefined,
    public queryTime: Date | undefined = undefined
  ) {}

  query(_: string): Promise<PncQueryResult | Error | undefined> {
    return Promise.resolve(this.result)
  }

  update(_operationCode: PncOperation, _request: PncUpdateRequest, _correlationId: string): PromiseResult<void> {
    return Promise.resolve()
  }
}
