import type { AsnQueryResponseExtended } from "../../../types/AsnQueryResponseExtended"
import ccrCofSegments from "./generators/ccrCofSegments"
import commonSegmentGenerator from "./generators/commonSegmentGenerator"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"

const convertLedsAsnQueryResponseJsonToXml = (ledsJson: AsnQueryResponseExtended) => {
  const output: string[] = []
  const gmh = commonSegmentGenerator("GMH", ledsJson.gmh)
  const gmt = commonSegmentGenerator("GMT", ledsJson.gmt)

  output.push(fscSegmentGenerator(ledsJson))
  output.push(idsSegmentGenerator(ledsJson))
  output.push(ccrCofSegments(ledsJson))

  return `<?XML VERSION="1.0" STANDALONE="YES"?><CXE01>${gmh}<ASI>${output.join("")}</ASI>${gmt}</CXE01>`
}

export default convertLedsAsnQueryResponseJsonToXml
