import type { CurrentAppearance, NextAppearance } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { AxiosError } from "axios"
import axios from "axios"
import https from "https"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import ApiError from "./ApiError"
import generateHeaders, { ENDPOINT_HEADERS } from "./generateHeaders"

export type RemandHeadline = {
  remandId: string
  appearanceResult: string
  remandDate: string
  currentAppearance: CurrentAppearance
  nextAppearance: Omit<NextAppearance, "forceStationCode">
}

type OffenceHeadline = {
  offenceId: string
  additionalOffenceMarker: boolean
  npccOffenceCode: string
  cjsOffenceCode: string
  qualifiedCjsCode: string
  startDate: string
  roleQualifier: string[]
  legislationQualifier: string[]
}

export type ArrestSummaries = {
  arrestReportHeadlines: {
    reportId: string
    asn: string
    processStage: string
    processStageDate: string
  }
  fingerprintStatusCode1: string
  offencesHeadlines: OffenceHeadline[]
  remandHeadlines: RemandHeadline[]
}

type ArrestSummariesResult = {
  arrestSummaries: ArrestSummaries[]
}

const fetchArrestSummaries = async (
  requestOptions: RequestOptions,
  person: PersonDetails
): Promise<ArrestSummaries[]> => {
  if (!person.personId) {
    throw Error("Person ID is missing. Person must be created first.")
  }

  const headers = generateHeaders(ENDPOINT_HEADERS.arrestSummaries, requestOptions.authToken)
  const response = await axios
    .get<ArrestSummariesResult>(
      `${requestOptions.baseUrl}/person-services/v1/people/${person.personId}/arrest-reports?offset=0&limit=999`,
      {
        headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      }
    )
    .catch((error: AxiosError) => error)

  if (isError(response)) {
    throw new ApiError(response)
  }

  return response.data.arrestSummaries
}

export default fetchArrestSummaries
