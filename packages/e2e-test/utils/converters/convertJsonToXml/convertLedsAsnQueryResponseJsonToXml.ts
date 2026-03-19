import type { AsnQueryResponseExtended } from "../../../types/AsnQueryResponseExtended"
import ccrCofSegments from "./generators/ccrCofSegments"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"

const convertLedsAsnQueryResponseJsonToXml = (ledsJson: AsnQueryResponseExtended) => {
  const output: string[] = []

  output.push(fscSegmentGenerator(ledsJson))
  output.push(idsSegmentGenerator(ledsJson))
  output.push(ccrCofSegments(ledsJson))

  return `<?XML VERSION="1.0" STANDALONE="YES"?><CXE01><ASI>${output.join("")}</ASI></CXE01>`
}

export default convertLedsAsnQueryResponseJsonToXml
