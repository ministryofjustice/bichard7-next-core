import NiamLedsAuthentication from "@moj-bichard7/core/lib/policeGateway/leds/NiamLedsAuthentication/NiamLedsAuthentication"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type LedsAuthentication from "@moj-bichard7/core/types/leds/LedsAuthentication"
import type { NonEmptyCourtCaseArray } from "../../../../types/LedsTestApiHelper/CourtCase"
import type { DisposalEntry } from "../../../../types/LedsTestApiHelper/DisposalHistoryResponse"
import type OffenceResponse from "../../../../types/LedsTestApiHelper/OffenceResponse"
import type PersonDetails from "../../../../types/LedsTestApiHelper/PersonDetails"
import type { RemandDetails } from "../../../../types/LedsTestApiHelper/RemandResponse"
import type RequestOptions from "../../../../types/LedsTestApiHelper/RequestOptions"
import { isError } from "../../../isError"
import type Bichard from "../../../world"
import addOffence from "./addOffence/addOffence"
import createArrestedPerson from "./createArrestedPerson/createArrestedPerson"
import createDisposal from "./createDisposal/createDisposal"
import fetchArrestSummaries from "./fetchArrestSummaries"
import fetchArrestSummons from "./fetchArrestSummons"
import fetchDisposalHistory from "./fetchDisposalHistory"
import fetchOffence from "./fetchOffence"
import fetchRemand from "./fetchRemand"
import findDisposalsByAsn from "./findDisposalsByAsn"

type TestArtifacts = {
  person: PersonDetails
  arrestSummonsNumber: string
  arrestSummonsId: string
}

export default class LedsTestApiHelper {
  private readonly authentication: LedsAuthentication
  private readonly baseUrl: string
  private artifacts: Record<string, TestArtifacts> = {}

  constructor(private readonly bichard: Bichard) {
    this.baseUrl = this.bichard.config.ledsApiUrl
    this.authentication = NiamLedsAuthentication.createInstance()
  }

  private generateCheckName(person: PersonDetails): string {
    return person.lastName.toLowerCase().slice(0, 15)
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

  getArtifacts() {
    this.artifacts[this.bichard.specFolder] ??= {} as TestArtifacts
    return this.artifacts[this.bichard.specFolder]
  }

  async createArrestedPersonAndDisposals(person: PersonDetails, courtCases: NonEmptyCourtCaseArray): Promise<string> {
    const requestOptions = await this.createRequestOptions(person)
    const { arrestSummonsNumber, arrestSummonsId, personId } = await createArrestedPerson(
      requestOptions,
      person,
      courtCases
    )

    const artifacts = this.getArtifacts()
    artifacts.person = person
    artifacts.arrestSummonsNumber = arrestSummonsNumber
    artifacts.arrestSummonsId = arrestSummonsId

    console.log(
      [
        `\tPerson ID: ${personId}`,
        `\tArrest Summons Number: ${arrestSummonsNumber}`,
        `\tArrest Summons ID: ${arrestSummonsId}`
      ].join("\n")
    )

    for (let courtCaseIndex = 0; courtCaseIndex < courtCases.length; courtCaseIndex++) {
      const courtCase = courtCases[courtCaseIndex]
      const offenceIds = await Promise.all(
        courtCase.offences
          .slice(courtCaseIndex === 0 ? 1 : 0) // Skipping the first offence as it's already been added when arrested person created
          .map((offence) => addOffence(requestOptions, person, offence, arrestSummonsId))
      )

      const arrestSummonOffences =
        (await fetchArrestSummons(requestOptions, person)).arrestSummaries
          .find((arrestSummon) => arrestSummon.asn === arrestSummonsNumber)
          ?.offences.filter(
            (offence) => courtCaseIndex === 0 || offenceIds.some((offenceId) => offence.offenceId === offenceId)
          ) ?? []

      await createDisposal(requestOptions, person, courtCase, arrestSummonOffences, arrestSummonsNumber)
    }

    return arrestSummonsNumber
  }

  async fetchRemandsAndOffences(): Promise<[OffenceResponse[], RemandDetails[]]> {
    const artifacts = this.getArtifacts()
    const requestOptions = await this.createRequestOptions(artifacts.person)
    const arrestSummaries = await fetchArrestSummaries(requestOptions, artifacts.person)
    const arrestSummary = arrestSummaries.find(
      (arrest) => arrest.arrestReportHeadlines.asn === artifacts.arrestSummonsNumber
    )
    const remandIds = (arrestSummary?.remandHeadlines ?? []).map((remand) => remand.remandId)
    const remands = (
      await Promise.all(
        remandIds.map((remandId) => fetchRemand(requestOptions, artifacts.person, artifacts.arrestSummonsId, remandId))
      )
    ).map((remand) => remand.content)
    const offenceIds = (arrestSummary?.offencesHeadlines ?? []).map((offence) => offence.offenceId)
    const offences = await Promise.all(
      offenceIds.map(async (offenceId) => {
        const offence = await fetchOffence(requestOptions, artifacts.person, artifacts.arrestSummonsId, offenceId)
        offence.id = offenceId
        return offence
      })
    )

    return [offences, remands]
  }

  async fetchDisposalsByAsn(): Promise<AsnQueryResponse> {
    const artifacts = this.getArtifacts()
    const requestOptions = await this.createRequestOptions(artifacts.person)
    return findDisposalsByAsn(requestOptions, artifacts.arrestSummonsNumber)
  }

  async fetchDisposals(): Promise<DisposalEntry[]> {
    const artifacts = this.getArtifacts()
    const requestOptions = await this.createRequestOptions(artifacts.person)
    const disposals = (await fetchDisposalHistory(requestOptions, artifacts.person)).entries

    return disposals
  }
}
