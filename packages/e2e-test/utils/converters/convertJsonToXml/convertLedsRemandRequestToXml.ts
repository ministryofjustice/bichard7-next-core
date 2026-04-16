import type { MockRemandRequest } from "../../../types/MockRemandRequest"
import asrSegmentGenerator from "./generators/asrSegmentGenerator"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import remSegmentGenerator from "./generators/remSegmentGenerator"

const convertLedsRemandRequestToXml = (ledsJson: MockRemandRequest): string => {
  const content = [
    fscSegmentGenerator(ledsJson),
    idsSegmentGenerator(ledsJson),
    asrSegmentGenerator(ledsJson.arrestSummonsNumber, ledsJson.crimeOffenceReferenceNo),
    remSegmentGenerator(ledsJson)
  ]

  return content.join("")
}

export default convertLedsRemandRequestToXml
