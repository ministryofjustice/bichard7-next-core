import endpoints from "@moj-bichard7/core/lib/policeGateway/leds/endpoints"
import NiamLedsAuthentication from "@moj-bichard7/core/lib/policeGateway/leds/NiamLedsAuthentication/NiamLedsAuthentication"
import type { AsnQueryRequest } from "@moj-bichard7/core/types/leds/AsnQueryRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type LedsAuthentication from "@moj-bichard7/core/types/leds/LedsAuthentication"
import type { AxiosError } from "axios"
import axios, { HttpStatusCode } from "axios"
import { randomUUID } from "crypto"
import https from "https"
import path from "path"
import type CourtCase from "../../../../types/LedsTestApi/CourtCase"
import type { NonEmptyCourtCaseArray } from "../../../../types/LedsTestApi/CourtCase"
import type { PendingRequest, RequestStatus } from "../../../../types/LedsTestApi/LedsAsyncRequest"
import type OffenceDetails from "../../../../types/LedsTestApi/OffenceDetails"
import type OffenceIdAndVersion from "../../../../types/LedsTestApi/OffenceIdAndVersion"
import type PersonDetails from "../../../../types/LedsTestApi/PersonDetails"
import { isError } from "../../../isError"
import type Bichard from "../../../world"
import mapToAddDisposalResult from "./mapToAddDisposalResult"
import mapToAddOffenceRequest from "./mapToAddOffenceRequest"
import mapToCreateArrestedPersonRequest from "./mapToCreateArrestedPersonRequest"
import mapToCreateDisposalRequest from "./mapToCreateDisposalRequest"

type CreateArrestedPersonResult = {
  arrestSummonsNumber: string
  arrestSummonsId: string
  personUrn: string
  personId: string
}

type AddOffenceResult = {
  chargeId: string
}

type CreateDisposalRequest = {
  courtCaseId: string
}

// type ArrestSummariesResult = {
//   arrestSummaries: {
//     offencesHeadlines: {
//       offenceId: string
//     }[]
//   }[]
// }

type AddOffenceParams = {
  offence: OffenceDetails
  personId: string
  arrestSummonsId: string
  checkname: string
}

type AddDisposalResultsParams = {
  person: PersonDetails
  courtCase: CourtCase
  arrestSummonsNumber: string
  checkname: string
}

const ENDPOINT_HEADERS = {
  createArrestedPerson: {
    "X-Leds-Action-Code": "Create Arrested Person",
    "X-Leds-Activity-Code": "Person Create",
    "X-Leds-Justification": "Create arrested person",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  addOffence: {
    "X-Leds-Action-Code": "Create Offence",
    "X-Leds-Activity-Code": "Person Update",
    "X-Leds-Justification": "Create impending prosecution",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  offenceLoop: {
    "X-Leds-Action-Code": "View Offence Details",
    "X-Leds-Activity-Code": "Person Enquiry",
    "X-Leds-Justification": "Offence enquiry loop",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  arrestSummaries: {
    "X-Leds-Action-Code": "View Arrest / Summons Summary",
    "X-Leds-Activity-Code": "Person Enquiry",
    "X-Leds-Justification": "Arrest summary",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  disposals: {
    "X-Leds-Action-Code": "Create Disposal",
    "X-Leds-Activity-Code": "Person Update",
    "X-Leds-Justification": "Create impending prosecution",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  },
  addDisposalResults: {
    "X-Leds-Action-Code": "Add Disposal Results",
    "X-Leds-Activity-Code": "Person Update",
    "X-Leds-Justification": "Add disposal results",
    "X-Leds-Reason": "0 - Transaction log and other audit checks"
  }
}

class ApiError extends Error {
  constructor({ response, request }: AxiosError) {
    super()
    this.message = `${response?.status} ${response?.statusText} [${request?.method} ${request?.path}] ${JSON.stringify(response?.data, null, 2)}`
  }
}

const delay = (delayInMs = 300) => new Promise((resolve) => setTimeout(resolve, delayInMs))

export default class LedsTestApiHelper {
  private readonly authentication: LedsAuthentication
  private readonly baseUrl: string
  arrestSummonsNumber: string | undefined

  constructor(private readonly bichard: Bichard) {
    this.baseUrl = this.bichard.config.ledsApiUrl
    this.authentication = NiamLedsAuthentication.createInstance()
  }

  async createArrestedPersonAndDisposals(person: PersonDetails, courtCases: NonEmptyCourtCaseArray): Promise<string> {
    const checkname = person.lastName.toLowerCase()
    const arrestedPersonRequest = mapToCreateArrestedPersonRequest(person, courtCases[0].offences[0], checkname)

    const { arrestSummonsNumber, arrestSummonsId, personId } = await this.request<CreateArrestedPersonResult>(
      "person-services/v1/people/create-arrested-person",
      arrestedPersonRequest,
      ENDPOINT_HEADERS.createArrestedPerson
    )
    person.personId = personId
    this.arrestSummonsNumber = arrestSummonsNumber

    for (let courtCaseIndex = 0; courtCaseIndex < courtCases.length; courtCaseIndex++) {
      const courtCase = courtCases[courtCaseIndex]

      const offencesResult: OffenceIdAndVersion[] = await Promise.all(
        courtCase.offences.map((offence) => this.addOffence({ offence, personId, arrestSummonsId, checkname }))
      )

      const disposalRequest = mapToCreateDisposalRequest(courtCase, offencesResult, person.forceOwnerCode, checkname)
      const { courtCaseId } = await this.request<CreateDisposalRequest>(
        `person-services/v1/people/${personId}/disposals`,
        disposalRequest,
        ENDPOINT_HEADERS.disposals
      )
      courtCase.courtCaseId = courtCaseId

      if (courtCase.offences.every((offence) => offence.results.length === 0)) {
        continue
      }

      await this.addDisposalResults({ person, courtCase, arrestSummonsNumber, checkname })
    }

    return arrestSummonsNumber
  }

  private async addDisposalResults({
    arrestSummonsNumber,
    person,
    courtCase,
    checkname
  }: AddDisposalResultsParams): Promise<void> {
    if (!person.personId || !courtCase.courtCaseId) {
      throw Error("Person ID and Court case ID must be provided.")
    }

    const disposal = await this.findDisposalByAsn(arrestSummonsNumber)
    const request = mapToAddDisposalResult(person, courtCase, disposal, checkname)

    const headers = await this.generateHeaders(ENDPOINT_HEADERS.addDisposalResults)
    const response = await axios
      .post(path.join(this.baseUrl, endpoints.addDisposal(person.personId, courtCase.courtCaseId)), request, {
        headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .catch((error: AxiosError) => error)

    if (isError(response)) {
      throw new ApiError(response)
    }
  }

  private async findDisposalByAsn(arrestSummonsNumber?: string): Promise<AsnQueryResponse> {
    const asn = arrestSummonsNumber ?? this.arrestSummonsNumber
    if (!asn) {
      throw new Error("Arrest summons number missing. Arrest must be created first.")
    }

    const request: AsnQueryRequest = {
      asn,
      caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
    }
    const headers = await this.generateHeaders(ENDPOINT_HEADERS.arrestSummaries)
    const response = await axios
      .post<AsnQueryResponse>(path.join(this.baseUrl, endpoints.asnQuery), request, {
        headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .catch((error: AxiosError) => error)

    if (isError(response)) {
      throw new ApiError(response)
    }

    return response.data
  }

  // private async fetchFirstOffenceDetails(personId: string, arrestSummonsId: string): Promise<OffenceIdAndVersion> {
  //   const headers = await this.generateHeaders(ENDPOINT_HEADERS.arrestSummaries)
  //   const response = await axios
  //     .get<ArrestSummariesResult>(
  //       path.join(this.baseUrl, `person-services/v1/people/${personId}/arrest-reports?offset=0&limit=999`),
  //       {
  //         headers,
  //         httpsAgent: new https.Agent({
  //           rejectUnauthorized: false
  //         })
  //       }
  //     )
  //     .catch((error: AxiosError) => error)

  //   if (isError(response)) {
  //     throw new ApiError(response)
  //   }

  //   const offenceId = response.data.arrestSummaries[0].offencesHeadlines[0].offenceId
  //   const version = await this.fetchOffenceVersion(personId, arrestSummonsId, offenceId)

  //   return { offenceId, version }
  // }

  private async addOffence({
    offence,
    personId,
    arrestSummonsId,
    checkname
  }: AddOffenceParams): Promise<OffenceIdAndVersion> {
    const offenceRequest = mapToAddOffenceRequest(offence, checkname)

    const { chargeId: offenceId } = await this.request<AddOffenceResult>(
      `person-services/v1/people/${personId}/arrest-reports/${arrestSummonsId}/offences`,
      offenceRequest,
      ENDPOINT_HEADERS.addOffence
    )

    offence.offenceId = offenceId
    const offenceVersion = await this.fetchOffenceVersion(personId, arrestSummonsId, offenceId)

    return { offenceId, version: offenceVersion }
  }

  private async fetchOffenceVersion(personId: string, arrestSummonsId: string, offenceId: string) {
    const headers = await this.generateHeaders(ENDPOINT_HEADERS.offenceLoop)
    const response = await axios
      .get<{ version: string }>(
        path.join(
          this.baseUrl,
          `person-services/v1/people/${personId}/arrest-reports/${arrestSummonsId}/offences/${offenceId}`
        ),
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

    return response.data.version
  }

  private async generateHeaders(endpointHeaders: Record<string, unknown>) {
    const authToken = await this.authentication.generateBearerToken()
    if (isError(authToken)) {
      throw Error(`Could not generate auth token. ${authToken.message}`)
    }

    return {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
      "X-Leds-Session-Id": randomUUID(),
      "X-Leds-System-Name": "Bichard7",
      "X-Leds-Application-Datetime": new Date().toISOString(),
      "X-Leds-On-Behalf-Of": "Bichard7",
      "X-Leds-Activity-Flow-Id": randomUUID(),
      "X-Leds-Reference-Id": randomUUID(),
      "X-Leds-Correlation-Id": randomUUID(),
      "Content-Type": "application/json",
      ...endpointHeaders
    }
  }

  private async request<T>(urlPath: string, body: unknown, endpointHeaders: Record<string, unknown>): Promise<T> {
    const pendingRequestHeaders = await this.generateHeaders(endpointHeaders)
    const url = path.join(this.baseUrl, urlPath)

    const pendingRequestResponse = await axios
      .post<PendingRequest>(url, body, {
        headers: pendingRequestHeaders,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .catch((error: AxiosError) => error)

    if (isError(pendingRequestResponse)) {
      throw new ApiError(pendingRequestResponse)
    }

    if (pendingRequestResponse.status !== HttpStatusCode.Accepted) {
      throw new Error(
        `Failed to send request to POST ${path.join(this.baseUrl, urlPath)}: ${pendingRequestResponse.status}, ${pendingRequestResponse.data}`
      )
    }

    const { requestId } = pendingRequestResponse.data

    await new Promise((resolve) => setTimeout(resolve, 100))

    for (let index = 0; index < 10; index++) {
      const statusRequestHeaders = await this.generateHeaders(endpointHeaders)
      const response = await axios
        .get<RequestStatus>(path.join(this.baseUrl, "person-services/v1/status", requestId), {
          headers: statusRequestHeaders,
          httpsAgent: new https.Agent({
            rejectUnauthorized: false
          })
        })
        .catch((error: AxiosError) => error)

      if (isError(response)) {
        if (response.response?.status === HttpStatusCode.NotFound) {
          await delay()
          continue
        }

        throw new ApiError(response)
      }

      if (response.status !== HttpStatusCode.Ok) {
        throw new Error(`Failed to check status for GET ${urlPath}: ${response.status}, ${response.data}`)
      }

      const requestDetails = response.data
      if (requestDetails.status === "Completed") {
        const result = requestDetails.associatedValues.reduce((acc: Record<string, string>, item) => {
          acc[this.toCamelCase(item.type)] = item.value
          return acc
        }, {})

        requestDetails.steps
          .filter((step) => step.relatedUUID)
          .forEach(({ relatedUUID }) => {
            result[this.toCamelCase(relatedUUID!.type)] = relatedUUID!.uuid
          })

        return result as T
      }

      await delay()
    }

    throw new Error(`Pending request didn't complete for ${urlPath}`)
  }

  private toCamelCase(text: string): string {
    return text.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  }
}
