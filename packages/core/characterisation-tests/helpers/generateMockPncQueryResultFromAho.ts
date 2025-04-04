import { XMLParser } from "fast-xml-parser"

import type { PncOffence, PncQueryResult } from "../../types/PncQueryResult"

type AhoPncCourtCase = {
  CCR: {
    "@_CourtCaseRefNo": string
    "@_CrimeOffenceRefNo": string
    "@_IntfcUpdateType": string
  }
  Offences: {
    Offence: AhoPncOffence | AhoPncOffence[]
  }
}

type AhoPncOffence = {
  COF: {
    "@_ACPOOffenceCode": string
    "@_CJSOffenceCode": string
    "@_IntfcUpdateType": string
    "@_OffenceQualifier1": string
    "@_OffenceQualifier2": string
    "@_OffenceTitle": string
    "@_OffEndDate": string
    "@_OffEndTime": string
    "@_OffStartDate": string
    "@_OffStartTime": string
    "@_ReferenceNumber": string
  }
}

type OffenceDates = {
  endDate?: Date
  startDate: Date
}

type ParsedAHO = {
  AnnotatedHearingOutcome: {
    CXE01: {
      CourtCases: {
        CourtCase: AhoPncCourtCase | AhoPncCourtCase[]
      }
      FSC: {
        "@_FSCode": string
        "@_IntfcUpdateType": string
      }
      IDS: {
        "@_Checkname": string
        "@_CRONumber": string
        "@_IntfcUpdateType": string
        "@_PNCID": string
      }
    }
  }
}

const parsePncDate = (pncDate: string): Date | null => {
  if (!pncDate || pncDate === "") {
    return null
  }

  const parsedDate = pncDate.match(/(\d{2})(\d{2})(\d{4})/)
  if (!parsedDate) {
    return null
  }

  const day = parseInt(parsedDate[1], 10)
  const month = parseInt(parsedDate[2], 10)
  const year = parseInt(parsedDate[3], 10)
  return new Date(Date.UTC(year, month - 1, day))
}

const extractDates = (offence: AhoPncOffence): OffenceDates => {
  const startDate = parsePncDate(offence.COF["@_OffStartDate"])
  if (!startDate) {
    throw new Error(`Start date could not be processed: ${offence.COF["@_OffStartDate"]}`)
  }

  const dates: OffenceDates = {
    startDate
  }
  const endDate = parsePncDate(offence.COF["@_OffEndDate"])
  if (endDate) {
    dates.endDate = endDate
  }

  return dates
}

/*
Sample CXE element
<CXE01>
    <FSC FSCode="01ZD" IntfcUpdateType="K"/>
    <IDS CRONumber="" Checkname="Hudson" IntfcUpdateType="K" PNCID="2000/0410925R"/>
    <CourtCases>
        <CourtCase>
            <CCR CourtCaseRefNo="97/1626/008395Q" CrimeOffenceRefNo="" IntfcUpdateType="K"/>
            <Offences>
                <Offence>
                    <COF ACPOOffenceCode="12:15:24:1" CJSOffenceCode="TH68010" IntfcUpdateType="K" OffEndDate="24092010" OffEndTime="0000" OffStartDate="20092010" OffStartTime="0000" OffenceQualifier1="" OffenceQualifier2="" OffenceTitle="Theft from a shop" ReferenceNumber="001"/>
                </Offence>
                <Offence>
                    <COF ACPOOffenceCode="12:15:24:1" CJSOffenceCode="TH68010" IntfcUpdateType="K" OffEndDate="24092010" OffEndTime="0000" OffStartDate="20092010" OffStartTime="0000" OffenceQualifier1="" OffenceQualifier2="" OffenceTitle="Theft from a shop" ReferenceNumber="002"/>
                </Offence>
            </Offences>
        </CourtCase>
    </CourtCases>
</CXE01>
*/

export default (ahoXml: string): PncQueryResult | undefined => {
  let cases
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }
  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(ahoXml) as ParsedAHO

  const cxe = rawParsedObj.AnnotatedHearingOutcome.CXE01

  if (!cxe) {
    return undefined
  }

  if (cxe.CourtCases) {
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
      offences: (courtCase.Offences.Offence as AhoPncOffence[]).map(
        (offence): PncOffence => ({
          offence: {
            acpoOffenceCode: offence.COF["@_ACPOOffenceCode"],
            cjsOffenceCode: offence.COF["@_CJSOffenceCode"],
            sequenceNumber: parseInt(offence.COF["@_ReferenceNumber"], 10),
            ...extractDates(offence)
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
    courtCases: cases
  }
  return result
}
