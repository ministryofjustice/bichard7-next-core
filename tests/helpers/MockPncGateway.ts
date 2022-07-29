import type PncGateway from "../../src/types/PncGateway"
import type { PncQueryResult } from "../../src/types/PncQueryResult"

export default class MockPncGateway implements PncGateway {
  constructor(private result: PncQueryResult | Error | undefined, public queryTime: Date | undefined = undefined) {}

  query(_: string): PncQueryResult | Error | undefined {
    return this.result
  }
}
