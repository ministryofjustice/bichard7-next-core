import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import type { IncomingMessageParsedXml, SpiOffence } from "@moj-bichard7/common/types/SpiResult"
import type { NonEmptyCourtCaseArray } from "../../../types/LedsTestApiHelper/CourtCase"
import type { NonEmptyOffenceDetailsArray } from "../../../types/LedsTestApiHelper/OffenceDetails"
import isRecordableOffence from "./isRecordableOffence"

const mapSpiToOffences = (spiOffences: SpiOffence[], forceOwnerCode: string): NonEmptyOffenceDetailsArray =>
  spiOffences
    .filter((spiOffence) => isRecordableOffence(spiOffence.BaseOffenceDetails.OffenceCode))
    .map((spiOffence) => ({
      ownerCode: forceOwnerCode,
      startDate: spiOffence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate,
      startTime: spiOffence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceStartTime,
      endDate: spiOffence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndDate,
      endTime: spiOffence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndTime,
      offenceLocation: spiOffence.BaseOffenceDetails.LocationOfOffence,
      offenceCode: spiOffence.BaseOffenceDetails.OffenceCode,
      convictionDate: spiOffence.ConvictionDate,
      verdict: spiOffence.Finding,
      plea: spiOffence.Plea
    })) as NonEmptyOffenceDetailsArray

const mapSpiToCourtCases = (spi: IncomingMessageParsedXml): NonEmptyCourtCaseArray => {
  const {
    Case: spiCase,
    CourtHearing: { Hearing: spiCourtHearing }
  } = spi.DeliverRequest.Message.ResultedCaseMessage.Session
  const forceOwnerCode = spiCase.PTIURN.substring(0, 4)
  const hearingLocation = spiCourtHearing.CourtHearingLocation
  const courtOrganisationUnit =
    organisationUnit.find(
      (ou) =>
        ou.topLevelCode === hearingLocation[0] &&
        ou.secondLevelCode === hearingLocation.substring(1, 3) &&
        ou.thirdLevelCode === hearingLocation.substring(3, 5)
    ) ??
    organisationUnit.find(
      (ou) => ou.topLevelCode === hearingLocation[0] && ou.secondLevelCode === hearingLocation.substring(1, 3)
    )
  const courtName = [
    courtOrganisationUnit?.topLevelName,
    courtOrganisationUnit?.secondLevelName,
    courtOrganisationUnit?.thirdLevelName
  ]
    .filter((x) => x)
    .join(" ")
  const dateOfHearing = spiCourtHearing.DateOfHearing
  const courtHearingLocation = spiCourtHearing.CourtHearingLocation
  const spiOffences = Array.isArray(spiCase.Defendant.Offence) ? spiCase.Defendant.Offence : [spiCase.Defendant.Offence]

  const offences = mapSpiToOffences(spiOffences, forceOwnerCode)

  return [
    {
      dateOfHearing,
      courtHearingLocation,
      offences,
      court: {
        courtIdentityType: "name",
        courtName
      }
    }
  ]
}

export default mapSpiToCourtCases
