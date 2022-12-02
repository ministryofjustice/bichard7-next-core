import axios from "axios"
import type PncGatewayInterface from "src/types/PncGatewayInterface"
import type { PncQueryResult } from "src/types/PncQueryResult"

export default class PncGateway implements PncGatewayInterface {
  // Constructor should take a PncApiConfig type that has API key and API url
  queryTime: Date | undefined

  async query(asn: string): Promise<PncQueryResult | Error | undefined> {
    // Query PNC (emulator)
    // Check response with zod
    // Return parsed response
    await axios.get(asn)
    return undefined
  }
}
