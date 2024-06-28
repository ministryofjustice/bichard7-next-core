import type { PncAdjudication } from "../types/PncQueryResult"

const GUILTY_DISPOSALS = [1029, 1030]
const NOT_GUILTY_DISPOSALS = [2006, 2050, 2051]
const EMPTY_VERDICT_DISPOSALS = [2058, 2059, 2060]
const NON_DATE_DISPOSALS = [2059, 2060, 2058]
const BLANK_PLEA_STATUS_CODES = [2060]

const preProcessVerdict = (disposalType: number | undefined, verdict: string): string => {
  const defaultVerdict = !verdict ? "NON-CONVICTION" : verdict

  if (!disposalType) {
    return defaultVerdict
  }

  if (GUILTY_DISPOSALS.includes(disposalType)) {
    return "GUILTY"
  }

  if (NOT_GUILTY_DISPOSALS.includes(disposalType)) {
    return "NOT GUILTY"
  }

  if (EMPTY_VERDICT_DISPOSALS.includes(disposalType)) {
    return ""
  }

  return defaultVerdict
}

const preProcessHearingDate = (disposalType: number | undefined, hearingDate: Date): Date | undefined =>
  !disposalType || !NON_DATE_DISPOSALS.includes(disposalType) ? hearingDate : undefined

const preProcessPleaStatus = (disposalType: number | undefined, pleaStatus: string): string =>
  disposalType && BLANK_PLEA_STATUS_CODES.includes(disposalType) ? "" : pleaStatus

const createPncAdjudication = (
  disposalType: number | undefined,
  pleaStatus: string,
  verdict: string,
  dateOfHearing: Date,
  numberOfOffencesTIC: number
): PncAdjudication => ({
  verdict: preProcessVerdict(disposalType, verdict),
  sentenceDate: preProcessHearingDate(disposalType, dateOfHearing),
  offenceTICNumber: numberOfOffencesTIC,
  plea: preProcessPleaStatus(disposalType, pleaStatus)
})

export default createPncAdjudication
