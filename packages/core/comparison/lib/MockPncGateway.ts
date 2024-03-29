import type PncGatewayInterface from "../../types/PncGatewayInterface"
import type { PncQueryResult } from "../../types/PncQueryResult"

export default class MockPncGateway implements PncGatewayInterface {
  constructor(
    private result: PncQueryResult | Error | undefined,
    public queryTime: Date | undefined = undefined
  ) {}

  query(_: string): Promise<PncQueryResult | Error | undefined> {
    return Promise.resolve(this.result)
  }
}
