import type { PartialPncMock, PncMockOptions } from "../../../types/PncMock"
import convertToXml from "../../converters/convertJsonToXml"

const generateRandomGmtSuffix = Math.floor(Math.random() * 8999) + 1000

const DEFAULT_MESSAGE = "A0031-REMAND REPORT HAS BEEN PROCESSED SUCCESSFULLY - ID: 00/263503N "
const DEFAULT_GMT = `073GENL000001RNEWREMPNCA05A73000017300000120210415154673000001                                             09000${
  generateRandomGmtSuffix
}`
const DEFAULT_GMH = "000003073GENL000001S"

export const generateUpdate = (code: string, options?: PncMockOptions): PartialPncMock => {
  let txt = DEFAULT_MESSAGE
  let gmh = DEFAULT_GMH
  let gmt = DEFAULT_GMT

  if (options?.response && typeof options?.response === "object" && "status" in options?.response) {
    txt = `${options.response.leds.errors[0].message}`
    gmh = options.response.gmh
    gmt = options.response.gmt
  }

  const response = `<?XML VERSION="1.0" STANDALONE="YES"?>
    <${code}>
      <GMH>${gmh}</GMH>
      <TXT>${txt}</TXT>
      <GMT>${gmt}</GMT>
    </${code}>`

  const expectedRequest =
    typeof options?.expectedRequest === "object"
      ? convertToXml(code, options?.expectedRequest)
      : options?.expectedRequest || ""

  return {
    matchRegex: options?.matchRegex || code,
    response,
    expectedRequest,
    count: options?.count || undefined
  }
}
