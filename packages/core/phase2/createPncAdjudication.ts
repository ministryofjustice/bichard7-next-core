import type { PncAdjudication } from "../types/PncQueryResult"

const createPncAdjudication = (
  disposalType: number | undefined,
  pleaStatus: string,
  verdict: string,
  dateOfHearing: Date,
  numberOfOffencesTIC: number
): PncAdjudication => {
  const adj: PncAdjudication = {
    verdict: preProcessVerdict(disposalType, verdict),
    sentenceDate: preProcessHearingDate(disposalType, dateOfHearing),
    offenceTICNumber: numberOfOffencesTIC,
    plea: preProcessPleaStatus(disposalType, pleaStatus)
  } as PncAdjudication
  return adj
}

const preProcessVerdict = (disposalType: number | undefined, verdict: string): string => {
  const defaultVerdict = !verdict ? "NON-CONVICTION" : verdict

  if (!disposalType) {
    return defaultVerdict
  }

  const GUILTY_DISPOSALS = [1029, 1030]
  if (GUILTY_DISPOSALS.includes(disposalType)) {
    return "GUILTY"
  }

  const NOT_GUILTY_DISPOSALS = [2006, 2050, 2051]
  if (NOT_GUILTY_DISPOSALS.includes(disposalType)) {
    return "NOT GUILTY"
  }

  const EMPTY_VERDICT_DISPOSALS = [2058, 2059, 2060]
  if (EMPTY_VERDICT_DISPOSALS.includes(disposalType)) {
    return ""
  }

  return defaultVerdict
}

const preProcessHearingDate = (disposalType: number | undefined, hearingDate: Date): Date | undefined => {
  const NON_DATE_DISPOSALS = [2059, 2060, 2058]
  if (!disposalType || !NON_DATE_DISPOSALS.includes(disposalType)) {
    return hearingDate
  }

  return
}

const preProcessPleaStatus = (disposalType: number | undefined, pleaStatus: string): string => {
  if (!disposalType) {
    return pleaStatus
  }

  const BLANK_PLEA_STATUS_CODES = [2060]
  return BLANK_PLEA_STATUS_CODES.includes(disposalType) ? "" : pleaStatus
}

export default createPncAdjudication
