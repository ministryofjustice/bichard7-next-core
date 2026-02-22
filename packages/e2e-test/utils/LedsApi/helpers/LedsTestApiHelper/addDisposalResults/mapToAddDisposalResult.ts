import { lookupPleaStatusBySpiCode, lookupVerdictBySpiCode } from "@moj-bichard7/common/aho/dataLookup/dataLookup"
import lookupOrganisationUnitByCode from "@moj-bichard7/common/aho/dataLookup/lookupOrganisationUnitByCode"
import getOrganisationUnit from "@moj-bichard7/common/aho/getOrganisationUnit"
import type { SpiPlea } from "@moj-bichard7/common/types/Plea"
import { toTitleCase } from "@moj-bichard7/core/lib/policeGateway/leds/mapToAddDisposalRequest/toTitleCase"
import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { Adjudication, Offence, Plea } from "@moj-bichard7/core/types/leds/DisposalRequest"
import type CourtCase from "../../../../../types/LedsTestApiHelper/CourtCase"
import type PersonDetails from "../../../../../types/LedsTestApiHelper/PersonDetails"

const mapToAddDisposalResult = (
  person: PersonDetails,
  courtCase: CourtCase,
  asnQueryResponse: AsnQueryResponse,
  checkName: string
): AddDisposalRequest => {
  const disposal = asnQueryResponse.disposals.find((disposal) => disposal.courtCaseId === courtCase.courtCaseId)
  if (!disposal) {
    throw Error(`No disposal found in ASN query response for court case ID ${courtCase.courtCaseId}`)
  }

  const offences: Offence[] = courtCase.offences.map((offence) => {
    const disposalOffence = disposal.offences.find((o) => o.offenceId === offence.offenceId)
    if (!disposalOffence) {
      throw Error(`No offence found in ASN query response for offence ID ${offence.offenceId}`)
    }

    const adjudication = offence.verdict
      ? (toTitleCase(lookupVerdictBySpiCode(offence.verdict)?.pncCode) as Adjudication)
      : undefined

    const offenceRequest: Offence = {
      offenceId: disposalOffence.offenceId,
      courtOffenceSequenceNumber: disposalOffence.courtOffenceSequenceNumber,
      adjudication,
      offenceStartDate: offence.startDate,
      dateOfSentence: offence.convictionDate,
      cjsOffenceCode: offence.offenceCode,
      plea: toTitleCase(lookupPleaStatusBySpiCode(offence.plea as SpiPlea)?.pncCode) as Plea,
      //   offenceTic,
      disposalResults: offence.results.map((result) => {
        const disposalResult: NonNullable<Offence["disposalResults"]>[number] = {
          disposalCode: result.resultCode,
          disposalEffectiveDate: result.disposalEffectiveDate
        }

        return disposalResult
      })
    }

    return offenceRequest
  })

  const courtHearingOrganisationUnit = lookupOrganisationUnitByCode(getOrganisationUnit(courtCase.courtHearingLocation))
  if (!courtHearingOrganisationUnit) {
    throw Error(`Court hearing organisation unit not found (${courtCase.courtHearingLocation}).`)
  }

  const courtName = [
    courtHearingOrganisationUnit.topLevelName,
    courtHearingOrganisationUnit.secondLevelName,
    courtHearingOrganisationUnit.thirdLevelName,
    courtHearingOrganisationUnit.bottomLevelName
  ]
    .filter((x) => x)
    .join(" ")

  return {
    ownerCode: asnQueryResponse.ownerCode,
    personUrn: asnQueryResponse.personUrn,
    checkName,
    courtCaseReference: disposal.courtCaseReference,
    court: {
      courtIdentityType: "name",
      courtName
    },
    dateOfConviction: courtCase.dateOfHearing,
    defendant: {
      defendantType: "individual",
      defendantFirstNames: person.firstNames,
      defendantLastName: person.lastName
    },
    offences: offences
    // additionalArrestOffences
  }
}

export default mapToAddDisposalResult
