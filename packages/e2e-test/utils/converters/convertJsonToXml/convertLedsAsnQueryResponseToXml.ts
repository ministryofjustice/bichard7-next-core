import type { MockAsnQueryErrorResponse } from "../../../types/MockAsnQueryErrorResponse"
import type { MockAsnQueryResponse } from "../../../types/MockAsnQueryResponse"
import { XML_DECLARATION } from "../../constants"
import commonSegmentGenerator from "./generators/commonSegmentGenerator"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import offenceSegmentsCXE01 from "./generators/offenceSegmentsCXE01"

const convertLedsAsnQueryResponseToXml = (mockJson: MockAsnQueryResponse | MockAsnQueryErrorResponse): string => {
  const gmh = commonSegmentGenerator("GMH", mockJson.gmh)
  const gmt = commonSegmentGenerator("GMT", mockJson.gmt)

  if ("txt" in mockJson) {
    const txt = commonSegmentGenerator("TXT", mockJson.txt)

    return `${XML_DECLARATION}<CXE01>${gmh}${txt}${gmt}</CXE01>`
  }

  const segments = [fscSegmentGenerator(mockJson), idsSegmentGenerator(mockJson), offenceSegmentsCXE01(mockJson)]
  const innerContent = segments.join("")

  return `${XML_DECLARATION}<CXE01>${gmh}<ASI>${innerContent}</ASI>${gmt}</CXE01>`
}

export default convertLedsAsnQueryResponseToXml
