import parseAnnotatedPncUpdateDatasetXml from "@moj-bichard7/common/aho/parse/parseAnnotatedPncUpdateDatasetXml/parseAnnotatedPncUpdateDatasetXml"
import { parsePncUpdateDataSetXml } from "@moj-bichard7/common/aho/parse/parsePncUpdateDataSetXml/index"
import { isError } from "@moj-bichard7/common/types/Result"

import getMessageType from "../../../phase1/lib/getMessageType"
import addMockToPnc from "../../../phase1/tests/helpers/addMockToPnc"
import clearMocksInPnc from "../../../phase1/tests/helpers/clearMocksInPnc"
import getPncErrorMessages from "./getPncErrorMessages"
import getPncOperationsFromPncUpdateDataset from "./getPncOperationsFromPncUpdateDataset"

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
  const beforeOperations = getPncOperationsFromPncUpdateDataset(parsedIncomingMessage)

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
    const afterOperations = getPncOperationsFromPncUpdateDataset(parsedOutgoingMessage)
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

  await clearMocksInPnc()
  for (const mock of mockOperationResults) {
    await addMockToPnc(mock.matchRegex, mock.response, mock.count)
  }
}

export default mockUpdatesInPnc
