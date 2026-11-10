import type { OffenceCode } from "../types/OffenceCode"
import type { ApiOffence } from "../types/StandingDataAPIResult"

export const convertApiResponse = (apiResponse: ApiOffence[] | Error): OffenceCode[] => {
  if (apiResponse instanceof Error) {
    throw new Error("apiResponse resulted in Error output")
  }

  return apiResponse.map((offenceCode) => ({
    cjsCode: offenceCode.code,
    offenceTitle: offenceCode.CjsTitle,
    offenceCategory: offenceCode.OffenceType
  }))
}
