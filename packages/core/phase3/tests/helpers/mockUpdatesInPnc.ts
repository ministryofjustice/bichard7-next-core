import axios from "axios"
import defaults from "../../../phase1/tests/helpers/defaults"
import { isError } from "@moj-bichard7/common/types/Result"
import type { Operation, PncUpdateDataset } from "../../../types/PncUpdateDataset"
import { parsePncUpdateDataSetXml } from "../../../phase2/parse/parsePncUpdateDataSetXml"
import getMessageType from "../../../phase1/lib/getMessageType"
import parseAnnotatedPncUpdateDatasetXml from "../../../phase2/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import type AnnotatedPncUpdateDataset from "../../../types/AnnotatedPncUpdateDataset"

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

const getOperations = (message: PncUpdateDataset | AnnotatedPncUpdateDataset): Operation[] => {
  if ("PncOperations" in message) {
    return message.PncOperations
  }

  return message.AnnotatedPNCUpdateDataset.PNCUpdateDataset.PncOperations
}

const getPncErrorMessages = (message: PncUpdateDataset | AnnotatedPncUpdateDataset): string[] => {
  const exceptions =
    "PncOperations" in message ? message.Exceptions : message.AnnotatedPNCUpdateDataset.PNCUpdateDataset.Exceptions

  return exceptions.filter((exception) => "message" in exception).map((exception) => exception.message)
}

const mockSuccessResponse = `<?XML VERSION="1.0" STANDALONE="YES"?>
    <CXU01>
      <GMH>073GENL000001RNEWREMPNCA05A73000017300000120210415154673000001                                             09000${
        Math.floor(Math.random() * 8999) + 1000
      }</GMH>
      <TXT>A0031-REMAND REPORT HAS BEEN PROCESSED SUCCESSFULLY - ID: 00/263503N </TXT>
      <GMT>000003073GENL000001S</GMT>
    </CXU01>`

const mockErrorResponse = (errorMessages: string[]) => `<?XML VERSION="1.0" STANDALONE="YES"?>
    <CXU01>
      <GMH>073GENL000001ENEWREMPNCA05A73000017300000120210415154673000001                                             09000${
        Math.floor(Math.random() * 8999) + 1000
      }</GMH>
      ${errorMessages.map((message) => `<TXT>${message}</TXT>`).join("\n")}
      <GMT>000003073GENL000001S</GMT>
    </CXU01>`

const mockUpdatesInPnc = async (incomingMessageXml: string, outgoingMessageXml?: string): Promise<void> => {
  const parsedIncomingMessage = parsePncUpdateDataSetXml(incomingMessageXml)
  if (isError(parsedIncomingMessage)) {
    throw new Error("Unable to parse incoming or outgoing message")
  }

  const mockOperationResults = []
  const beforeOperations = getOperations(parsedIncomingMessage)

  if (outgoingMessageXml) {
    const outgoingMessageType = getMessageType(outgoingMessageXml)
    const parsedOutgoingMessage =
      outgoingMessageType === "PncUpdateDataset"
        ? parsePncUpdateDataSetXml(outgoingMessageXml)
        : parseAnnotatedPncUpdateDatasetXml(outgoingMessageXml)

    if (isError(parsedOutgoingMessage)) {
      throw new Error("Unable to parse incoming or outgoing message")
    }

    const beforeUnattemptedOperations = beforeOperations.filter((operation) => operation.status !== "Completed")
    const afterOperations = getOperations(parsedOutgoingMessage)
    const afterUnattemptedOperations = afterOperations.filter((operation) => operation.status === "NotAttempted")
    const afterFailedOperations = afterOperations.filter((operation) => operation.status === "Failed")
    const errorMessages = getPncErrorMessages(parsedOutgoingMessage)

    const completedOperationCount =
      beforeUnattemptedOperations.length - afterUnattemptedOperations.length - afterFailedOperations.length

    for (let i = 0; i < completedOperationCount; ++i) {
      mockOperationResults.push({
        matchRegex: "CXU",
        response: mockSuccessResponse,
        count: 1
      })
    }

    if (errorMessages.length > 0) {
      mockOperationResults.push({
        matchRegex: "CXU",
        response: mockErrorResponse(errorMessages),
        count: 1
      })
    }
  } else {
    for (let i = 0; i < beforeOperations.length; ++i) {
      mockOperationResults.push({
        matchRegex: "CXU",
        response: mockSuccessResponse,
        count: 1
      })
    }
  }

  await clearMocks()
  for (const mock of mockOperationResults) {
    await addMock(mock.matchRegex, mock.response, mock.count)
  }
}

export default mockUpdatesInPnc
