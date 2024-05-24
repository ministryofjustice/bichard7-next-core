import type { ExceptionPath } from "../types/Exception"

const offencePath = (offenceIndex: number): ExceptionPath => [
  "AnnotatedHearingOutcome",
  "HearingOutcome",
  "Case",
  "HearingDefendant",
  ...(offenceIndex < 0 ? [] : ["Offence", offenceIndex])
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
  cjsResultCode: resultPath(offenceIndex, resultIndex).concat("CJSresultCode"),
  resultClass: resultPath(offenceIndex, resultIndex).concat("ResultClass"),
  nextHearingDate: resultPath(offenceIndex, resultIndex).concat("NextHearingDate"),
  nextResultSourceOrganisation: {
    organisationUnitCode: resultPath(offenceIndex, resultIndex).concat(
      "NextResultSourceOrganisation",
      "OrganisationUnitCode"
    )
  },
  resultVariableText: resultPath(offenceIndex, resultIndex).concat("ResultVariableText"),
  resultQualifierVariable: resultQualifierVariable(offenceIndex, resultIndex),
  amountSpecifiedInResult: (amountSpecifiedInResultIndex: number) =>
    resultPath(offenceIndex, resultIndex).concat("AmountSpecifiedInResult", amountSpecifiedInResultIndex)
})

const offence = (offenceIndex: number) => ({
  courtCaseReference: offencePath(offenceIndex).concat("CourtCaseReferenceNumber"),
  reasonSequence: offencePath(offenceIndex).concat("CriminalProsecutionReference", "OffenceReasonSequence"),
  offenceReason: {
    offenceCodeReason: offencePath(offenceIndex).concat(
      "CriminalProsecutionReference",
      "OffenceReason",
      "OffenceCode",
      "Reason"
    ),
    localOffenceCode: offencePath(offenceIndex).concat(
      "CriminalProsecutionReference",
      "OffenceReason",
      "LocalOffenceCode",
      "OffenceCode"
    )
  },
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
