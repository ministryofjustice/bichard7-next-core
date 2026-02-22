import NiamLedsAuthentication from "@moj-bichard7/core/lib/policeGateway/leds/NiamLedsAuthentication/NiamLedsAuthentication"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type LedsAuthentication from "@moj-bichard7/core/types/leds/LedsAuthentication"
import type { NonEmptyCourtCaseArray } from "../../../../types/LedsTestApiHelper/CourtCase"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import type Bichard from "../../../world"
import addOffence from "./addOffence/addOffence"
import createArrestedPerson from "./createArrestedPerson/createArrestedPerson"
import createDisposal from "./createDisposal/createDisposal"
import type { ArrestSummaries } from "./fetchArrestSummaries"
import fetchArrestSummaries from "./fetchArrestSummaries"
import findDisposalsByAsn from "./findDisposalsByAsn"

export default class LedsTestApiHelper {
  private readonly authentication: LedsAuthentication
  private readonly baseUrl: string
  private person: PersonDetails
  private arrestSummonsNumber: string

  constructor(private readonly bichard: Bichard) {
    this.baseUrl = this.bichard.config.ledsApiUrl
    this.authentication = NiamLedsAuthentication.createInstance()
  }

  private generateCheckName(person: PersonDetails): string {
    return person.lastName.toLowerCase()
  }

  private async createRequestOptions(person: PersonDetails): Promise<RequestOptions> {
    const authToken = await this.authentication.generateBearerToken()
    if (isError(authToken)) {
      throw authToken
    }

    return {
      authToken,
      baseUrl: this.baseUrl.slice(0, this.baseUrl.endsWith("/") ? -1 : undefined),
      checkName: this.generateCheckName(person)
    }
  }

  async createArrestedPersonAndDisposals(person: PersonDetails, courtCases: NonEmptyCourtCaseArray): Promise<string> {
    const requestOptions = await this.createRequestOptions(person)
    const { arrestSummonsNumber, arrestSummonsId, personId } = await createArrestedPerson(
      requestOptions,
      person,
      courtCases
    )

    this.person = person
    this.arrestSummonsNumber = arrestSummonsNumber

    console.log({
      "Person ID": personId,
      "Arrest Summons Number": arrestSummonsNumber,
      "Arrest Summons ID": arrestSummonsId
    })

    await Promise.all(
      courtCases.map(async (courtCase) => {
        const offencesResult = await Promise.all(
          courtCase.offences.map((offence) => addOffence(requestOptions, person, offence, arrestSummonsId))
        )

        return createDisposal(requestOptions, person, courtCase, offencesResult, arrestSummonsNumber)
      })
    )

    return arrestSummonsNumber
  }

  async fetchArrestSummaries(): Promise<ArrestSummaries[]> {
    const requestOptions = await this.createRequestOptions(this.person)
    return fetchArrestSummaries(requestOptions, this.person)
  }

  async fetchDisposals(): Promise<AsnQueryResponse> {
    const requestOptions = await this.createRequestOptions(this.person)
    return findDisposalsByAsn(requestOptions, this.arrestSummonsNumber)
  }
}
