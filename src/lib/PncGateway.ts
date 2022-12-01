import type PncGatewayInterface from "src/types/PncGatewayInterface"
import type { PncQueryResult } from "src/types/PncQueryResult"

export default class PncGateway implements PncGatewayInterface {
  queryTime: Date | undefined

  query(_: string): PncQueryResult | Error | undefined {
    // Query PNC (emulator)
    // Check response with zod
    // Return parsed response
    return undefined
  }
}
