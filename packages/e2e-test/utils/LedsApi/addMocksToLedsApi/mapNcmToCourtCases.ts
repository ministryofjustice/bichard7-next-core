import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import type CourtCase from "../../../types/LedsTestApiHelper/CourtCase"
import type { NonEmptyCourtCaseArray } from "../../../types/LedsTestApiHelper/CourtCase"
import type { NonEmptyOffenceDetailsArray } from "../../../types/LedsTestApiHelper/OffenceDetails"
import type ParsedNcm from "../../../types/ParsedNcm"
import type { ParsedNcmOffence } from "../../../types/ParsedNcm"
import isRecordableOffence from "./isRecordableOffence"

const mapNcmToOffences = (
  ncmOffences: ParsedNcmOffence[],
  forceOwnerCode: string
): Record<string, NonEmptyOffenceDetailsArray> =>
  ncmOffences
    .filter((spiOffence) => isRecordableOffence(spiOffence.BaseOffenceDetails.OffenceCode))
    .reduce(
      (groups, ncmOffence) => {
        const ncmResults = !ncmOffence.Result
          ? []
          : Array.isArray(ncmOffence.Result)
            ? ncmOffence.Result
            : [ncmOffence.Result]

        const offence = {
          ownerCode: forceOwnerCode,
          startDate: ncmOffence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate,
          startTime: ncmOffence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartTime,
          endDate: ncmOffence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndDate,
          endTime: ncmOffence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndTime,
          offenceLocation: ncmOffence.BaseOffenceDetails.LocationOfOffence,
          offenceCode: ncmOffence.BaseOffenceDetails.OffenceCode,
          convictionDate: ncmOffence.ConvictionDate,
          verdict: ncmOffence.Finding,
          plea: ncmOffence.Plea,
          results:
            ncmResults.map((result) => ({
              resultCode: result.ResultCode,
              resultText: result.ResultText,
              disposalEffectiveDate: result.DisposalEffectiveDate
            })) ?? []
        }

        const disposalGroup = ncmOffence.DisposalGroup ?? "0"
        if (!groups[disposalGroup]) {
          groups[disposalGroup] = [offence]
        } else {
          groups[disposalGroup].push(offence)
        }

        return groups
      },
      {} as Record<string, NonEmptyOffenceDetailsArray>
    )

const mapNcmToCourtCases = (ncm: ParsedNcm): NonEmptyCourtCaseArray => {
  const forceOwnerCode = ncm.NewCaseMessage.Case.PTIURN.substring(0, 4)
  const hearingLocation = ncm.NewCaseMessage.Case.InitialHearing.CourtHearingLocation
  const courtOrganisationUnit =
    organisationUnit.find(
      (ou) =>
        ou.topLevelCode === hearingLocation[0] &&
        ou.secondLevelCode === hearingLocation.substring(1, 3) &&
        ou.thirdLevelCode === hearingLocation.substring(3, 5)
    ) ??
    organisationUnit.find(
      (ou) => ou.topLevelCode === hearingLocation[0] && ou.secondLevelCode === hearingLocation.substring(1, 3)
    ) ??
    organisationUnit.find((ou) => ou.topLevelCode === hearingLocation[0])
  const courtName = [
    courtOrganisationUnit?.topLevelName,
    courtOrganisationUnit?.secondLevelName,
    courtOrganisationUnit?.thirdLevelName
  ]
    .filter((x) => x)
    .join(" ")
  const dateOfHearing = ncm.NewCaseMessage.Case.InitialHearing.DateOfHearing
  const courtHearingLocation = ncm.NewCaseMessage.Case.InitialHearing.CourtHearingLocation
  const ncmOffences = Array.isArray(ncm.NewCaseMessage.Case.Defendant.Offence)
    ? ncm.NewCaseMessage.Case.Defendant.Offence
    : [ncm.NewCaseMessage.Case.Defendant.Offence]

  const offencesGroups = mapNcmToOffences(ncmOffences, forceOwnerCode)

  return Object.keys(offencesGroups).reduce(
    (courtCases, group) => {
      const courtCase: CourtCase = {
        dateOfHearing,
        courtHearingLocation,
        offences: offencesGroups[group],
        court: {
          courtIdentityType: "name",
          courtName
        }
      }

      courtCases.push(courtCase)

      return courtCases
    },
    [] as unknown as NonEmptyCourtCaseArray
  )
}

export default mapNcmToCourtCases
