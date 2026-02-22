import type CourtCase from "../../../../../types/LedsTestApiHelper/CourtCase"
import type OffenceIdAndVersion from "../../../../../types/LedsTestApiHelper/OffenceIdAndVersion"
import type Disposals from "../../../../../types/LedsTestApiHelper/Requests/Disposals"
import type { Court } from "../../../../../types/LedsTestApiHelper/Requests/Disposals"

const mapCourt = (courtCase: CourtCase): Court =>
  courtCase.court.courtIdentityType === "code"
    ? {
        courtIdentityType: "code",
        courtCode: courtCase.court.courtCode
      }
    : {
        courtIdentityType: "name",
        courtName: courtCase.court.courtName
      }

const mapToCreateDisposalRequest = (
  courtCase: CourtCase,
  linkedOffences: OffenceIdAndVersion[],
  forceCode: string,
  checkName: string
): Disposals => ({
  fsCodeMakingChange: forceCode,
  checkname: checkName,
  content: {
    linkedOffences: linkedOffences.map((linkedOffence) => ({
      versionToChange: linkedOffence.version,
      offenceId: linkedOffence.offenceId
    })),
    disposal: {
      forceStationInCase: forceCode,
      convictionDate: courtCase.dateOfHearing,
      court: mapCourt(courtCase),
      caseStatusMarker: "impending-prosecution-detail"
    }
  }
})

export default mapToCreateDisposalRequest
