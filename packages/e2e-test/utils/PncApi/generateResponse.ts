import type { UpdateResponse } from "@moj-bichard7/core/types/leds/UpdateResponse"
import type { MockErrorResponse } from "../../types/MockErrorResponse"

const generateRandomGmtSuffix = Math.floor(Math.random() * 8999) + 1000

const DEFAULT_MESSAGE = "A0031-REMAND REPORT HAS BEEN PROCESSED SUCCESSFULLY - ID: 00/263503N "
const DEFAULT_GMH = `073GENL000001RNEWREMPNCA05A73000017300000120210415154673000001                                             09000${
  generateRandomGmtSuffix
}`
const DEFAULT_GMT = "000003073GENL000001S"

const generateResponse = (code: string, mockResponse?: UpdateResponse | MockErrorResponse): string => {
  let txt = DEFAULT_MESSAGE
  let gmh = DEFAULT_GMH
  let gmt = DEFAULT_GMT

  if (mockResponse && "status" in mockResponse) {
    txt = `${mockResponse.leds.errors[0].message}`
    gmh = mockResponse.gmh
    gmt = mockResponse.gmt
  }

  return `<?XML VERSION="1.0" STANDALONE="YES"?>
    <${code}>
      <GMH>${gmh}</GMH>
      <TXT>${txt}</TXT>
      <GMT>${gmt}</GMT>
    </${code}>`
}

export default generateResponse
