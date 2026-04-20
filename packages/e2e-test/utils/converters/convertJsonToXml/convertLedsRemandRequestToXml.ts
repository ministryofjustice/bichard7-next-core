import type { MockRemandRequest } from "../../../types/MockRemandRequest"
import asrSegmentGenerator from "./generators/asrSegmentGenerator"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import remSegmentGenerator from "./generators/remSegmentGenerator"

const convertLedsRemandRequestToXml = (mockJson: MockRemandRequest): string => {
  const content = [
    fscSegmentGenerator(mockJson),
    idsSegmentGenerator(mockJson),
    asrSegmentGenerator(mockJson.arrestSummonsNumber, mockJson.crimeOffenceReferenceNo),
    remSegmentGenerator(mockJson)
  ]

  return content.join("")
}

export default convertLedsRemandRequestToXml
