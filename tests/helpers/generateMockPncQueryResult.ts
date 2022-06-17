import merge from "lodash.merge"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import type { PncOffence, PncQueryResult } from "src/types/PncQueryResult"
import parseSpiResult from "src/use-cases/parseSpiResult"

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
  pncCaseType = "court"
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
        sequenceNumber: offence.BaseOffenceDetails.OffenceSequenceNumber,
        ...dates
      }
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
