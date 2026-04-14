import type { PartialPncMock, PncMockOptions } from "../../../types/PncMock"
import convertLedsAddDisposalRequestToXml from "../../converters/convertJsonToXml/convertLedsAddDisposalRequestToXml"

export const generateUpdate = (code: string, options?: PncMockOptions): PartialPncMock => {
  const response =
    options?.response ??
    `<?XML VERSION="1.0" STANDALONE="YES"?>
    <${code}>
      <GMH>073GENL000001RNEWREMPNCA05A73000017300000120210415154673000001                                             09000${
        Math.floor(Math.random() * 8999) + 1000
      }</GMH>
      <TXT>A0031-REMAND REPORT HAS BEEN PROCESSED SUCCESSFULLY - ID: 00/263503N </TXT>
      <GMT>000003073GENL000001S</GMT>
    </${code}>`

  let expectedRequest = ""
  if (code === "CXU02" && !!options?.expectedRequest) {
    expectedRequest = convertLedsAddDisposalRequestToXml(JSON.parse(options.expectedRequest))
  } else {
    expectedRequest = options?.expectedRequest || ""
  }

  return {
    matchRegex: options?.matchRegex || code,
    response,
    expectedRequest,
    count: options?.count || undefined
  }
}
