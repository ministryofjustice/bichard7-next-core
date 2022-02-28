import type PncGateway from "../../src/types/PncGateway"
import type { PncQueryResult } from "../../src/types/PncQueryResult"

export default class MockPncGateway implements PncGateway {
  constructor(private result: PncQueryResult) {}

  query(_: string): PncQueryResult {
    return this.result
  }
}
