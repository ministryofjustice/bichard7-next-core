import type { PncCourtCase, PNCDisposal, PncOffence, PncPenaltyCase, PncQueryResult } from "src/types/PncQueryResult"
import type { Cxe01, Dis, RawAhoPncOffence } from "src/types/RawAho"
import parsePncDate from "./parsePncDate"

type OffenceDates = {
  startDate: Date
  endDate?: Date
}
type OffenceTimes = {
  startTime?: string
  endTime?: string
}

const extractDates = (offence: RawAhoPncOffence): OffenceDates => {
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

const extractTimes = (offence: RawAhoPncOffence): OffenceTimes => {
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

const mapXmlDisposalsToAho = (dis: Dis | Dis[] | undefined): PNCDisposal[] | undefined => {
  if (!dis) {
    return undefined
  }
  const allDis = Array.isArray(dis) ? dis : [dis]
  return allDis.map((disElem) => ({
    qtyDate: disElem["@_QtyDate"],
    qtyDuration: disElem["@_QtyDuration"],
    type: Number(disElem["@_Type"]),
    qtyUnitsFined: disElem["@_QtyUnitsFined"],
    qtyMonetaryValue: disElem["@_QtyMonetaryValue"],
    qualifiers: disElem["@_Qualifiers"],
    text: disElem["@_Text"]
  }))
}

const mapXmlOffencesToAho = (offences: RawAhoPncOffence[]): PncOffence[] =>
  offences.map(
    (offence): PncOffence => ({
      offence: {
        acpoOffenceCode: offence.COF["@_ACPOOffenceCode"],
        cjsOffenceCode: offence.COF["@_CJSOffenceCode"],
        title: offence.COF["@_OffenceTitle"],
        sequenceNumber: parseInt(offence.COF["@_ReferenceNumber"], 10),
        ...extractDates(offence),
        ...extractTimes(offence)
      },
      disposals: mapXmlDisposalsToAho(offence.DISList?.DIS)
    })
  )

const mapXmlCxe01ToAho = (cxe: Cxe01 | undefined) => {
  let courtCases: PncCourtCase[] | undefined
  let penaltyCases: PncPenaltyCase[] | undefined
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
    courtCases = cxe.CourtCases?.CourtCase.map((courtCase) => ({
      courtCaseReference: courtCase.CCR["@_CourtCaseRefNo"],
      offences: mapXmlOffencesToAho(courtCase.Offences.Offence as RawAhoPncOffence[])
    }))
  }
  if (cxe.PenaltyCases && cxe.PenaltyCases.PenaltyCase) {
    if (!Array.isArray(cxe.PenaltyCases.PenaltyCase)) {
      cxe.PenaltyCases.PenaltyCase = [cxe.PenaltyCases.PenaltyCase]
    }
    for (const penaltyCase of cxe.PenaltyCases.PenaltyCase) {
      if (!Array.isArray(penaltyCase.Offences.Offence)) {
        penaltyCase.Offences.Offence = [penaltyCase.Offences.Offence]
      }
    }
    penaltyCases = cxe.PenaltyCases?.PenaltyCase.map((penaltyCase) => ({
      penaltyCaseReference: penaltyCase.PCR["@_PenaltyCaseRefNo"],
      offences: mapXmlOffencesToAho(penaltyCase.Offences.Offence as RawAhoPncOffence[])
    }))
  }

  const checkName = cxe.IDS["@_Checkname"]
  const result: PncQueryResult = {
    forceStationCode: cxe.FSC["@_FSCode"],
    checkName,
    pncId: cxe.IDS["@_PNCID"],
    courtCases,
    penaltyCases
  }
  return result
}

export default mapXmlCxe01ToAho
