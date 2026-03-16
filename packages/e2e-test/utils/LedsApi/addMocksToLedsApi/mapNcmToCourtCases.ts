import { organisationUnit } from "@moj-bichard7-developers/bichard7-next-data"
import type { NonEmptyCourtCaseArray } from "../../../types/LedsTestApiHelper/CourtCase"
import type { NonEmptyOffenceDetailsArray } from "../../../types/LedsTestApiHelper/OffenceDetails"
import type ParsedNcm from "../../../types/ParsedNcm"
import type { ParsedNcmOffence } from "../../../types/ParsedNcm"

const mapNcmToOffences = (ncmOffences: ParsedNcmOffence[], forceOwnerCode: string): NonEmptyOffenceDetailsArray =>
  ncmOffences.map((ncmOffence) => {
    const ncmResults = !ncmOffence.Result
      ? []
      : Array.isArray(ncmOffence.Result)
        ? ncmOffence.Result
        : [ncmOffence.Result]

    return {
      ownerCode: forceOwnerCode,
      startDate: ncmOffence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
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
  }) as NonEmptyOffenceDetailsArray

const mapNcmToCourtCases = (ncm: ParsedNcm): NonEmptyCourtCaseArray => {
  const forceOwnerCode = ncm.NewCaseMessage.Case.PTIURN.substring(0, 4)
  const hearingLocation = ncm.NewCaseMessage.Case.InitialHearing.CourtHearingLocation
  const courtOrganisationUnit = organisationUnit.find(
    (ou) =>
      ou.topLevelCode === hearingLocation[0] &&
      ou.secondLevelCode === hearingLocation.substring(1, 3) &&
      ou.thirdLevelCode === hearingLocation.substring(3, 5)
  )
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

  const offences = mapNcmToOffences(ncmOffences, forceOwnerCode)

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

export default mapNcmToCourtCases
