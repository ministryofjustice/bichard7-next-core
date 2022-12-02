import axios from "axios"
import type PncApiConfig from "src/types/PncApiConfig"
import type PncGatewayInterface from "src/types/PncGatewayInterface"
import type { PncQueryResult } from "src/types/PncQueryResult"
import dateTransformer from "./axiosDateTransformer"

axios.defaults.transformResponse = [dateTransformer]

export default class PncGateway implements PncGatewayInterface {
  constructor(private config: PncApiConfig) {}

  queryTime: Date | undefined

  query(asn: string): Promise<PncQueryResult | Error | undefined> {
    this.queryTime = new Date()
    return axios
      .get<PncQueryResult>(`${this.config.url}/${asn}`)
      .then((result) => {
        return result.data
      })
      .catch((e) => e)
  }
}
