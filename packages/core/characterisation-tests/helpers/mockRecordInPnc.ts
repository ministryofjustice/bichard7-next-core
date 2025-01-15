import type { AxiosResponse } from "axios"

import axios from "axios"
import merge from "lodash.merge"

import type { OffenceParsedXml, ResultedCaseMessageParsedXml } from "../../types/SpiResult"

import parseSpiResult from "../../lib/parse/parseSpiResult"
import config from "./config"
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

const mockEnquiryError = (
  pncErrorMessage: string = "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410832Q) NOT FOUND"
): string => {
  return `<?xml version="1.0" standalone="yes"?>
  <CXE01>
  <GMH>073ENQR000018EERRASIPNCA05A73000017300000120210915101073000001                                             050001777</GMH>
  <TXT>${pncErrorMessage}</TXT>
  <GMT>000003073ENQR000018E</GMT></CXE01>`
}

const mockUpdateError = (
  pncErrorMessage: string = "I1008 - GWAY - ENQUIRY ERROR ARREST/SUMMONS REF (11/01ZD/01/410832Q) NOT FOUND"
): string => {
  return `<?XML VERSION="1.0" STANDALONE="YES"?>
  <CXU02>
  <GMH>073GENL000001EDISARRPNCA05A73000017300000120210415154673000001                                             050001777</GMH>
  <TXT>${pncErrorMessage}</TXT>
  <GMT>000003073GENL000001S</GMT>
  </CXU02>`
}

const addMock = async (matchRegex: string, response: string, count: null | number = null): Promise<string> => {
  const data = { matchRegex, response, count }
  const resp = await axios.post(`http://${config.pncHost}:${config.pncPort}/mocks`, data)
  if (resp.status < 200 || resp.status >= 300) {
    throw new Error("Error setting mock in PNC Emulator")
  }

  return resp.headers.location.replace("/mocks/", "")
}

const clearMocks = async (): Promise<void> => {
  let response: AxiosResponse | Error | undefined = undefined
  for (let attempt = 0; attempt < 5; attempt++) {
    response = await axios.delete(`http://${config.pncHost}:${config.pncPort}/mocks`).catch((e: Error) => e)

    if (response instanceof Error) {
      await new Promise((resolve) => setTimeout(resolve, 1_000))
    } else {
      break
    }
  }

  if (response instanceof Error || response?.status !== 204) {
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

const mockEnquiryErrorInPnc = async (pncErrorMessage?: string): Promise<void> => {
  const enquiryError = mockEnquiryError(pncErrorMessage)
  await clearMocks()
  await addMock("CXE01", enquiryError)
}

const mockUpdateErrorInPnc = async (pncErrorMessage?: string): Promise<void> => {
  const enquiryError = mockUpdateError(pncErrorMessage)
  await clearMocks()
  await addMock("CXU02", enquiryError)
}

export { addMock, mockEnquiry, mockEnquiryErrorInPnc, mockRecordInPnc, mockUpdateErrorInPnc }
