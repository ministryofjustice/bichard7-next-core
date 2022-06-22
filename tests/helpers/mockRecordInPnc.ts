import axios from "axios"
import merge from "lodash.merge"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "src/types/IncomingMessage"
import parseSpiResult from "src/use-cases/parseSpiResult"
import defaults from "./defaults"
import reformatDate from "./reformatDate"

const extractDates = (offence: OffenceParsedXml) => {
  const startDate = reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceStart.OffenceDateStartDate)
  let endDate: string

  if (
    offence.BaseOffenceDetails.OffenceTiming.OffenceEnd &&
    offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate
  ) {
    endDate = reformatDate(offence.BaseOffenceDetails.OffenceTiming.OffenceEnd.OffenceEndDate)
  } else {
    endDate = "            "
  }
  return { startDate, endDate }
}

const mockEnquiry = (
  messageXml: string,
  pncOverrides: Partial<ResultedCaseMessageParsedXml> = {},
  pncCaseType = "court",
  pncAdjudication = false
) => {
  const parsed = parseSpiResult(messageXml).DeliverRequest.Message.ResultedCaseMessage
  const result = merge(parsed, pncOverrides)

  const prosecutorRef = result.Session.Case.Defendant.ProsecutorReference.slice(-7)
  const personFamilyName =
    result.Session.Case.Defendant.CourtIndividualDefendant!.PersonDefendant.BasePersonDetails.PersonName.PersonFamilyName.substr(
      0,
      12
    ).padEnd(12, " ")
  const offences = result.Session.Case.Defendant.Offence.map((offence) => ({
    code: offence.BaseOffenceDetails.OffenceCode.padEnd(8, " "),
    sequenceNo: offence.BaseOffenceDetails.OffenceSequenceNumber.toString().padStart(3, "0"),
    ...extractDates(offence)
  }))
  const forceStationCode = result.Session.Case.PTIURN.substr(0, 4)

  const cofString = offences
    .map((offence) => {
      const output = [
        `<COF>K${offence.sequenceNo}    12:15:24:1   ${offence.code}${offence.startDate}${offence.endDate}</COF>`
      ]
      if (pncAdjudication) {
        output.push("<ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>")
      }
      if (pncCaseType === "penalty" || pncAdjudication) {
        output.push(
          "<DIS>I1109000C 100.00                                                                                         </DIS>"
        )
      }
      return output.join("\n")
    })
    .join("\n")

  const pncCaseElem = pncCaseType === "court" ? "CCR" : "PCR"

  const response = `<?XML VERSION="1.0" STANDALONE="YES"?>
  <CXE01>
    <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
    <ASI>
      <FSC>K${forceStationCode}</FSC>
      <IDS>K00/${prosecutorRef} ${personFamilyName}            </IDS>
      <${pncCaseElem}>K97/1626/839512Q    ${pncCaseElem === "CCR" ? "           " : ""}</${pncCaseElem}>
      ${cofString}
    </ASI>
    <GMT>000008073ENQR004540S</GMT>
  </CXE01>`

  return {
    matchRegex: "CXE01",
    response
  }
}

const mockEnquiryError = (): string => {
  return '<?xml version="1.0" standalone="yes"?><CXE01><GMH>073ENQR000018EERRASIPNCA05A73000017300000120210915101073000001                                             050001777</GMH><TXT>I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410832Q) NOT FOUND                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </TXT><GMT>000003073ENQR000018E</GMT></CXE01>'
}

const addMock = async (matchRegex: string, response: string, count: number | null = null): Promise<string> => {
  const data = { matchRegex, response, count }
  const resp = await axios.post(`http://${defaults.pncHost}:${defaults.pncPort}/mocks`, data)
  if (resp.status < 200 || resp.status >= 300) {
    throw new Error("Error setting mock in PNC Emulator")
  }
  return resp.headers.location.replace("/mocks/", "")
}

const clearMocks = async (): Promise<void> => {
  const response = await axios.delete(`http://${defaults.pncHost}:${defaults.pncPort}/mocks`)
  if (response.status !== 204) {
    throw new Error("Error clearing mocks in PNC Emulator")
  }
}

const mockRecordInPnc = async (
  messageXml: string,
  pncOverrides: Partial<ResultedCaseMessageParsedXml> = {},
  pncCaseType = "court",
  pncAdjudication = false
): Promise<void> => {
  const enquiry = mockEnquiry(messageXml, pncOverrides, pncCaseType, pncAdjudication)
  await clearMocks()
  await addMock(enquiry.matchRegex, enquiry.response)
}

const mockEnquiryErrorInPnc = async (): Promise<void> => {
  const enquiryError = mockEnquiryError()
  await clearMocks()
  await addMock("CXE01", enquiryError)
}

export { mockRecordInPnc, mockEnquiryErrorInPnc, mockEnquiry }
