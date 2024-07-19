import merge from "lodash.merge"
import parseSpiResult from "../../../lib/parse/parseSpiResult"
import type { PncOffence, PncQueryResult } from "../../../types/PncQueryResult"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "../../../types/SpiResult"

type OffenceDates = {
  startDate: Date
  endDate?: Date
}

const extractDates = (offence: OffenceParsedXml): OffenceDates => {
  const dates: OffenceDates = {
    startDate: new Date(offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate)
  }
  if (offence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndDate) {
    dates.endDate = new Date(offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate)
  }

  return dates
}

export default (
  xml: string,
  pncOverrides: Partial<ResultedCaseMessageParsedXml> = {},
  pncCaseType = "court",
  pncAdjudication = false
): PncQueryResult => {
  const spi = merge(parseSpiResult(xml).DeliverRequest.Message.ResultedCaseMessage, pncOverrides)

  const spiCase = spi.Session.Case
  const checkName =
    spiCase.Defendant.CourtIndividualDefendant!.PersonDefendant.BasePersonDetails.PersonName.PersonFamilyName.substr(
      0,
      12
    )
  const prosecutorRef = spiCase.Defendant.ProsecutorReference.slice(-8)
  const offences = spiCase.Defendant.Offence.map((offence: OffenceParsedXml): PncOffence => {
    const dates = extractDates(offence)
    return {
      offence: {
        acpoOffenceCode: "12:15:24:1",
        cjsOffenceCode: offence.BaseOffenceDetails.OffenceCode,
        sequenceNumber: Number(offence.BaseOffenceDetails.OffenceSequenceNumber),
        ...dates
      },
      ...(pncAdjudication && {
        adjudication: { verdict: "GUILTY", sentenceDate: new Date("2020-01-02"), offenceTICNumber: 1, plea: "GUILTY" }
      })
    }
  })

  const pncCase =
    pncCaseType === "court"
      ? {
          courtCases: [
            {
              courtCaseReference: "12/3456/789012Q",
              offences
            }
          ]
        }
      : {
          penaltyCases: [
            {
              penaltyCaseReference: "12/3456/789012Q",
              offences
            }
          ]
        }

  const result: PncQueryResult = {
    forceStationCode: spiCase.PTIURN.substring(0, 3),
    checkName,
    pncId: `2000/${prosecutorRef}`,
    ...pncCase
  }
  return result
}
