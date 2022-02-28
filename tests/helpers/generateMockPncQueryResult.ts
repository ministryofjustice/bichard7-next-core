import type { OffenceParsedXml } from "../../src/types/IncomingMessage"
import type { PncQueryResult, PncOffence } from "../../src/types/PncQueryResult"
import parseSpiResult from "../../src/use-cases/parseSpiResult"
import reformatDate from "./reformatDate"

type OffenceDates = {
  startDate: string
  endDate?: string
}

const extractDates = (offence: OffenceParsedXml) => {
  const dates: OffenceDates = {
    startDate: reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate)
  }
  if (offence.BaseOffenceDetails.OffenceTiming.OffenceEnd?.OffenceEndDate) {
    dates.endDate = reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate)
  }

  return dates
}

export default (xml: string): PncQueryResult => {
  const spi = parseSpiResult(xml)
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
        courtCaseReference: "97/1626/008395Q",
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
