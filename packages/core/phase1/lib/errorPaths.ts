import type { ExceptionPath } from "../types/Exception"

const offencePath = (offenceIndex: number): ExceptionPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  "Offence",
  offenceIndex
]

const resultPath = (offenceIndex: number, resultIndex: number): ExceptionPath =>
  offencePath(offenceIndex).concat("Result", resultIndex)

const result = (offenceIndex: number) => (resultIndex: number) => ({
  resultClass: resultPath(offenceIndex, resultIndex).concat("ResultClass"),
  nextHearingDate: resultPath(offenceIndex, resultIndex).concat("NextHearingDate"),
  nextResultSourceOrganisation: {
    organisationUnitCode: resultPath(offenceIndex, resultIndex).concat(
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    )
  }
})

const offence = (offenceIndex: number) => ({
  courtCaseReference: offencePath(offenceIndex).concat("CourtCaseReferenceNumber"),
  reasonSequence: offencePath(offenceIndex).concat("CriminalProsecutionReference", "OffenceReasonSequence"),
  result: result(offenceIndex)
})

const casePath = ["AnnotatedHearingOutcome", "HearingOutcome", "Case"]
const $case = {
  asn: casePath.concat("HearingDefendant", "ArrestSummonsNumber"),
  magistratesCourtReference: casePath.concat("CourtReference", "MagistratesCourtReference")
}

const errorPaths = {
  offence,
  case: $case
}

export default errorPaths
