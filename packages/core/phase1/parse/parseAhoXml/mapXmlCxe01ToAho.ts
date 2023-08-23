import parsePncDate from "phase1/lib/parsePncDate"
import type { Adj, AhoXmlPncOffence, Cxe01, Dis } from "phase1/types/AhoXml"
import type {
  PncAdjudication,
  PncCourtCase,
  PncDisposal,
  PncOffence,
  PncPenaltyCase,
  PncQueryResult
} from "types/PncQueryResult"

type OffenceDates = {
  startDate: Date
  endDate?: Date
}
type OffenceTimes = {
  startTime?: string
  endTime?: string
}

const extractDates = (offence: AhoXmlPncOffence): OffenceDates => {
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

const extractTimes = (offence: AhoXmlPncOffence): OffenceTimes => {
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

const mapXmlDisposalsToAho = (dis: Dis | Dis[] | undefined): PncDisposal[] | undefined => {
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

const mapXmlAdjudicationsToAho = (adj: Adj | undefined): PncAdjudication | undefined => {
  if (!adj) {
    return undefined
  }
  return {
    verdict: adj["@_Adjudication1"],
    sentenceDate: parsePncDate(adj["@_DateOfSentence"]),
    plea: adj["@_Plea"],
    offenceTICNumber: Number(adj["@_OffenceTICNumber"]),
    weedFlag: adj["@_WeedFlag"]
  }
}

const mapXmlOffencesToAho = (offences: AhoXmlPncOffence[]): PncOffence[] =>
  offences.map(
    (offence): PncOffence => ({
      offence: {
        acpoOffenceCode: offence.COF["@_ACPOOffenceCode"],
        cjsOffenceCode: offence.COF["@_CJSOffenceCode"],
        title: offence.COF["@_OffenceTitle"],
        sequenceNumber: parseInt(offence.COF["@_ReferenceNumber"], 10),
        qualifier1: offence.COF["@_OffenceQualifier1"],
        qualifier2: offence.COF["@_OffenceQualifier2"],
        ...extractDates(offence),
        ...extractTimes(offence)
      },
      adjudication: mapXmlAdjudicationsToAho(offence.ADJ),
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
      offences: mapXmlOffencesToAho(courtCase.Offences.Offence as AhoXmlPncOffence[])
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
      offences: mapXmlOffencesToAho(penaltyCase.Offences.Offence as AhoXmlPncOffence[])
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
