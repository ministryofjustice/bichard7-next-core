import type { ExceptionPath } from "../../types/Exception"

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

const resultQualifierVariablePath = (offenceIndex: number, resultIndex: number, qualifierIndex: number) =>
  resultPath(offenceIndex, resultIndex).concat("ResultQualifierVariable", qualifierIndex)

const resultQualifierVariable = (offenceIndex: number, resultIndex: number) => (qualifierVariableIndex: number) => ({
  Code: resultQualifierVariablePath(offenceIndex, resultIndex, qualifierVariableIndex).concat("Code"),
  DurationType: resultQualifierVariablePath(offenceIndex, resultIndex, qualifierVariableIndex).concat(
    "Duration",
    "DurationType"
  )
})

const result = (offenceIndex: number) => (resultIndex: number) => ({
  amountSpecifiedInResult: (amountSpecifiedInResultIndex: number) =>
    resultPath(offenceIndex, resultIndex).concat("AmountSpecifiedInResult", amountSpecifiedInResultIndex),
  cjsResultCode: resultPath(offenceIndex, resultIndex).concat("CJSresultCode"),
  nextHearingDate: resultPath(offenceIndex, resultIndex).concat("NextHearingDate"),
  nextResultSourceOrganisation: {
    organisationUnitCode: resultPath(offenceIndex, resultIndex).concat(
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    )
  },
  resultClass: resultPath(offenceIndex, resultIndex).concat("ResultClass"),
  resultQualifierVariable: resultQualifierVariable(offenceIndex, resultIndex),
  resultVariableText: resultPath(offenceIndex, resultIndex).concat("ResultVariableText")
})

const offence = (offenceIndex: number) => ({
  courtCaseReference: offencePath(offenceIndex).concat("CourtCaseReferenceNumber"),
  offenceReason: {
    localOffenceCode: offencePath(offenceIndex).concat(
      "CriminalProsecutionReference",
      "OffenceReason",
      "LocalOffenceCode",
      "OffenceCode"
    ),
    offenceCodeReason: offencePath(offenceIndex).concat(
      "CriminalProsecutionReference",
      "OffenceReason",
      "OffenceCode",
      "Reason"
    )
  },
  reasonSequence: offencePath(offenceIndex).concat("CriminalProsecutionReference", "OffenceReasonSequence"),
  result: result(offenceIndex)
})

const casePath = ["AnnotatedHearingOutcome", "HearingOutcome", "Case"]
const $case = {
  asn: casePath.concat("HearingDefendant", "ArrestSummonsNumber"),
  magistratesCourtReference: casePath.concat("CourtReference", "MagistratesCourtReference")
}

const errorPaths = {
  case: $case,
  offence
}

export default errorPaths
