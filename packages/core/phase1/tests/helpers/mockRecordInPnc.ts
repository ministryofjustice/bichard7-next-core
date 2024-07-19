import { isError } from "@moj-bichard7/common/types/Result"
import axios from "axios"
import merge from "lodash.merge"
import { toPNCDate } from "../../../lib/dates"
import { parseAhoXml } from "../../../lib/parse/parseAhoXml"
import parseSpiResult from "../../../lib/parse/parseSpiResult"
import type { PncCourtCase, PncQueryResult } from "../../../types/PncQueryResult"
import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "../../../types/SpiResult"
import defaults from "../../tests/helpers/defaults"
import reformatDate from "../../tests/helpers/reformatDate"

type PncMock = {
  matchRegex: string
  response: string
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

  return resp.headers.location!.replace("/mocks/", "")
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

const generateOffenceXml = (courtCase: PncCourtCase): string[] =>
  courtCase.offences.reduce((acc: string[], { offence, adjudication, disposals }) => {
    const sequenceNumber = offence.sequenceNumber.toString().padStart(3, "0")
    const acpoOffenceCode = offence.acpoOffenceCode?.padEnd(13, " ")
    const offenceCode = offence.cjsOffenceCode.padEnd(8, " ")
    const startDate = toPNCDate(offence.startDate)
    const startTime = offence.startTime ? offence.startTime.replace(":", "") : "    "
    const endDate = offence.endDate ? toPNCDate(offence.endDate) : "        "
    const endTime = offence.endTime ? offence.endTime.replace(":", "") : "    "

    acc.push(
      `<COF>K${sequenceNumber}    ${acpoOffenceCode}${offenceCode}${startDate}${startTime}${endDate}${endTime}</COF>`
    )

    if (adjudication) {
      const dateOfSentence = adjudication.sentenceDate && toPNCDate(adjudication.sentenceDate)
      const plea = adjudication.plea.padEnd(13, " ")
      const verdict = adjudication.verdict.padEnd(14, " ")
      acc.push(`<ADJ>I${plea}${verdict}${dateOfSentence}0000 </ADJ>`)
    }

    disposals?.forEach((disposal) => {
      const type = disposal.type?.toString().padStart(4, "0")
      const duration = (disposal.qtyDuration ?? "").padEnd(4, " ")
      acc.push(
        `<DIS>I${type}${duration} 100.00                                                                                         </DIS>`
      )
    })
    return acc
  }, [])

const formatCcr = (pncId: string): string => {
  const idSegments = pncId.split("/")
  idSegments[2] = idSegments[2].replace(/^0+/, "")
  return idSegments.join("/").padEnd(15, " ")
}

const mockEnquiryFromPncResult = (pncQueryResult: PncQueryResult): PncMock => {
  const pncCaseType = "court" // TODO: make this work with penalty cases too
  const pncCaseElem = pncCaseType === "court" ? "CCR" : "PCR"
  const splitPncId = pncQueryResult.pncId.split("/")
  const pncYear = splitPncId[0].slice(2)
  const pncId = splitPncId[1].slice(-7)
  const response = [
    '<?XML VERSION="1.0" STANDALONE="YES"?>',
    "<CXE01>",
    "<GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>",
    "<ASI>",
    `<FSC>K${pncQueryResult.forceStationCode}</FSC>`,
    `<IDS>K${pncYear}/${pncId} ${pncQueryResult.checkName.padEnd(12, " ")}            </IDS>`
  ]

  pncQueryResult.courtCases?.forEach((courtCase) => {
    const padding = pncCaseElem === "CCR" ? "           " : ""
    response.push(`<${pncCaseElem}>K${formatCcr(courtCase.courtCaseReference)}    ${padding}</${pncCaseElem}>`)
    response.push(...generateOffenceXml(courtCase))
  })

  response.push("</ASI>", "<GMT>000008073ENQR004540S</GMT>", "</CXE01>")

  /*
<?XML VERSION=\"1.0\" STANDALONE=\"YES\"?>
    <CXE01>
      <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K00/448754K SEXOFFENCE              </IDS>
        <CCR>K97/1626/8395Q                 </CCR>
        <COF>K001    12:15:24:1   SX03001A281120100000            </COF>
<COF>K002    12:15:24:1   SX03001 281120100000            </COF>
<COF>K003    12:15:24:1   RT88191 281120100000            </COF>
      </ASI>
      <GMT>000008073ENQR004540S</GMT>
    </CXE01>
  */

  /*
    <CXE01>
        <FSC FSCode="01ZD" IntfcUpdateType="K" />
        <IDS CRONumber="" Checkname="SEXOFFENCE" IntfcUpdateType="K" PNCID="2000/0448754K" />
        <CourtCases>
            <CourtCase>
                <CCR CourtCaseRefNo="97/1626/008395Q" CrimeOffenceRefNo="" IntfcUpdateType="K" />
                <Offences>
                    <Offence>
                        <COF ACPOOffenceCode="12:15:24:1" CJSOffenceCode="SX03001A" IntfcUpdateType="K" OffEndDate="" OffEndTime="" OffStartDate="28112010" OffStartTime="0000" OffenceQualifier1="" OffenceQualifier2="" OffenceTitle="Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003" ReferenceNumber="001" />
                    </Offence>
                    <Offence>
                        <COF ACPOOffenceCode="12:15:24:1" CJSOffenceCode="SX03001" IntfcUpdateType="K" OffEndDate="" OffEndTime="" OffStartDate="28112010" OffStartTime="0000" OffenceQualifier1="" OffenceQualifier2="" OffenceTitle="Rape a girl aged 13 / 14 / 15 - SOA 2003" ReferenceNumber="002" />
                    </Offence>
                    <Offence>
                        <COF ACPOOffenceCode="12:15:24:1" CJSOffenceCode="RT88191" IntfcUpdateType="K" OffEndDate="" OffEndTime="" OffStartDate="28112010" OffStartTime="0000" OffenceQualifier1="" OffenceQualifier2="" OffenceTitle="Use a motor vehicle on a road / public place without third party insurance" ReferenceNumber="003" />
                    </Offence>
                </Offences>
            </CourtCase>
        </CourtCases>
    </CXE01>
    */

  return {
    matchRegex: "CXE01",
    response: response.join("\n")
  }
}

const mockEnquiryErrorInPnc = async (): Promise<void> => {
  const enquiryError = mockEnquiryError()
  await clearMocks()
  await addMock("CXE01", enquiryError)
}

const mockAhoRecordInPnc = async (messageXml: string): Promise<void> => {
  const parsedAho = parseAhoXml(messageXml)
  if (isError(parsedAho)) {
    throw parsedAho
  }

  if (parsedAho.PncQuery) {
    const mock = mockEnquiryFromPncResult(parsedAho.PncQuery)
    await clearMocks()
    await addMock(mock.matchRegex, mock.response)
  } else {
    mockEnquiryErrorInPnc()
  }
}

export { mockAhoRecordInPnc, mockEnquiry, mockEnquiryErrorInPnc, mockEnquiryFromPncResult, mockRecordInPnc }
