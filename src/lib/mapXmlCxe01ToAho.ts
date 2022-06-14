import type { PncCase, PncOffence, PncQueryResult } from "src/types/PncQueryResult"
import type { Cxe01, RawOffence } from "src/types/RawAho"
import parsePncDate from "./parsePncDate"

type OffenceDates = {
  startDate: Date
  endDate?: Date
}
type OffenceTimes = {
  startTime?: string
  endTime?: string
}

const extractDates = (offence: RawOffence): OffenceDates => {
  const startDate = parsePncDate(offence.COF["@_OffStartDate"])
  if (!startDate) {
    throw new Error(`Start date could not be processed: ${offence.COF["@_OffStartDate"]}`)
  }
  const dates: OffenceDates = {
    startDate
  }
  if (offence.COF["@_OffEndDate"] && offence.COF["@_OffEndDate"] !== "") {
    const endDate = parsePncDate(offence.COF["@_OffEndDate"])
    if (endDate) {
      dates.endDate = endDate
    }
  }

  return dates
}

const extractTimes = (offence: RawOffence): OffenceTimes => {
  const times: OffenceTimes = { startTime: undefined, endTime: undefined }
  const cofStartTime = offence.COF["@_OffStartTime"]
  if (cofStartTime && cofStartTime !== "" && cofStartTime.length === 4) {
    times.startTime = `${cofStartTime.substring(0, 2)}:${cofStartTime.substring(2)}`
  }

  const cofEndTime = offence.COF["@_OffEndTime"]
  if (cofEndTime && cofEndTime !== "" && cofEndTime.length === 4) {
    times.endTime = `${cofEndTime.substring(0, 2)}:${cofEndTime.substring(2)}`
  }

  return times
}

const mapXmlCxe01ToAho = (cxe: Cxe01 | undefined) => {
  let cases: PncCase[] | undefined
  if (!cxe) {
    return undefined
  }

  if (cxe.CourtCases && cxe.CourtCases.CourtCase) {
    if (!Array.isArray(cxe.CourtCases.CourtCase)) {
      cxe.CourtCases.CourtCase = [cxe.CourtCases.CourtCase]
    }
    for (const courtCase of cxe.CourtCases.CourtCase) {
      if (!Array.isArray(courtCase.Offences.Offence)) {
        courtCase.Offences.Offence = [courtCase.Offences.Offence]
      }
    }
    cases = cxe.CourtCases?.CourtCase.map((courtCase) => ({
      courtCaseReference: courtCase.CCR["@_CourtCaseRefNo"],
      offences: (courtCase.Offences.Offence as RawOffence[]).map(
        (offence): PncOffence => ({
          offence: {
            acpoOffenceCode: offence.COF["@_ACPOOffenceCode"],
            cjsOffenceCode: offence.COF["@_CJSOffenceCode"],
            title: offence.COF["@_OffenceTitle"],
            sequenceNumber: parseInt(offence.COF["@_ReferenceNumber"], 10),
            ...extractDates(offence),
            ...extractTimes(offence)
          }
        })
      )
    }))
  }

  const checkName = cxe.IDS["@_Checkname"]
  const result: PncQueryResult = {
    forceStationCode: cxe.FSC["@_FSCode"],
    checkName,
    pncId: cxe.IDS["@_PNCID"],
    cases
  }
  return result
}

export default mapXmlCxe01ToAho
