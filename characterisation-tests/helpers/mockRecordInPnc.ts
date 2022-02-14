import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "../../src/types/IncomingMessage"
import parseMessage from "../../src/use-cases/parseMessage"
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from "axios"
import defaults from "./defaults"

const reformatDate = (input: string): string => {
  const res = input.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (res && res[1] && res[2] && res[3]) {
    return `${res[3]}${res[2]}${res[1]}`.padEnd(12, "0")
  }

  throw new Error("Error formatting date")
}

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
const mockEnquiry = (messageXml: string) => {
  const parsed: ResultedCaseMessageParsedXml = parseMessage(messageXml)
  const prosecutorRef = parsed.Session.Case.Defendant.ProsecutorReference.slice(-7)
  const personFamilyName =
    parsed.Session.Case.Defendant.CourtIndividualDefendant.PersonDefendant.BasePersonDetails.PersonName.PersonFamilyName.substr(
      0,
      12
    ).padEnd(12, " ")
  const offences = parsed.Session.Case.Defendant.Offence.map((offence) => ({
    code: offence.BaseOffenceDetails.OffenceCode.padEnd(8, " "),
    sequenceNo: offence.BaseOffenceDetails.OffenceSequenceNumber.toString().padStart(3, "0"),
    ...extractDates(offence)
  }))
  const forceStationCode = parsed.Session.Case.PTIURN.substr(0, 4)

  const cofString = offences
    .map(
      (offence) =>
        `<COF>K${offence.sequenceNo}    12:15:24:1   ${offence.code}${offence.startDate}${offence.endDate}</COF>`
    )
    .join("\n")

  const response = `<?XML VERSION="1.0" STANDALONE="YES"?>
  <CXE01>
    <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
    <ASI>
      <FSC>K${forceStationCode}</FSC>
      <IDS>K00/${prosecutorRef} ${personFamilyName}            </IDS>
      <CCR>K97/1626/8395Q                 </CCR>
      ${cofString}
    </ASI>
    <GMT>000008073ENQR004540S</GMT>
  </CXE01>`

  return {
    matchRegex: "CXE01",
    response
  }
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

export default async (messageXml: string): Promise<void> => {
  const enquiry = mockEnquiry(messageXml)
  await clearMocks()
  await addMock(enquiry.matchRegex, enquiry.response)
}
