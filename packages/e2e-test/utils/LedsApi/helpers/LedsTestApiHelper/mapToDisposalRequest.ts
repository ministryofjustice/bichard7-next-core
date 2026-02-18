import type CourtCase from "../../../../types/LedsTestApi/CourtCase"
import type OffenceIdAndVersion from "../../../../types/LedsTestApi/OffenceIdAndVersion"
import type Disposals from "../../../../types/LedsTestApi/Requests/Disposals"
import type { Court } from "../../../../types/LedsTestApi/Requests/Disposals"

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

const mapToDisposalRequest = (
  courtCase: CourtCase,
  linkedOffences: OffenceIdAndVersion[],
  forceCode: string,
  checkname: string
): Disposals => ({
  fsCodeMakingChange: forceCode,
  checkname,
  content: {
    linkedOffences: linkedOffences.map((linkedOffence) => ({
      versionToChange: linkedOffence.version,
      offenceId: linkedOffence.offenceId
    })),
    disposal: {
      forceStationInCase: forceCode,
      convictionDate: courtCase.convictionDate,
      court: mapCourt(courtCase),
      caseStatusMarker: "impending-prosecution-detail"
    }
  }
})

export default mapToDisposalRequest
