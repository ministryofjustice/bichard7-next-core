import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "../../src/types/IncomingMessage"
import type { PncQueryResult, PncOffence } from "../../src/types/PncQueryResult"
import parseSpiResult from "../../src/use-cases/parseSpiResult"
import merge from "lodash.merge"

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

export default (xml: string, pncOverrides: Partial<ResultedCaseMessageParsedXml> = {}): PncQueryResult => {
  const spi = merge(parseSpiResult(xml), pncOverrides)

  const spiCase = spi.DeliverRequest.Message.ResultedCaseMessage.Session.Case
  const checkName =
    spiCase.Defendant.CourtIndividualDefendant!.PersonDefendant.BasePersonDetails.PersonName.PersonFamilyName.substr(
      0,
      12
    )
  const prosecutorRef = spiCase.Defendant.ProsecutorReference.slice(-7)
  const result: PncQueryResult = {
    forceStationCode: spiCase.PTIURN.substring(0, 3),
    checkName,
    pncId: `2000/${prosecutorRef}`,
    cases: [
      {
        courtCaseReference: spiCase.PTIURN,
        offences: spiCase.Defendant.Offence.map((offence: OffenceParsedXml): PncOffence => {
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
      }
    ]
  }
  return result
}
