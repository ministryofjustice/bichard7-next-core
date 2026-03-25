import type { AsnQueryResponseExtended } from "../../../types/AsnQueryResponseExtended"
import { XML_DECLARATION } from "../../constants"
import commonSegmentGenerator from "./generators/commonSegmentGenerator"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import offenceSegments from "./generators/offenceSegments"

const convertLedsAsnQueryResponseToXml = (ledsJson: AsnQueryResponseExtended) => {
  const gmh = commonSegmentGenerator("GMH", ledsJson.gmh)
  const gmt = commonSegmentGenerator("GMT", ledsJson.gmt)
  const segments = [fscSegmentGenerator(ledsJson), idsSegmentGenerator(ledsJson), offenceSegments(ledsJson)]
  const innerContent = segments.join("")

  return `${XML_DECLARATION}<CXE01>${gmh}<ASI>${innerContent}</ASI>${gmt}</CXE01>`
}

export default convertLedsAsnQueryResponseToXml
