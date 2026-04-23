import type { MockSubsequentDisposalResultsRequest } from "../../../types/MockSubsequentDisposalResultsRequest"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import offenceSegmentsCXU04 from "./generators/offenceSegmentsCXU04"
import subSegmentGenerator from "./generators/subSegmentGenerator"

const convertLedsSubsequentDisposalRequestToXmls = (mockJson: MockSubsequentDisposalResultsRequest): string => {
  const content = [
    fscSegmentGenerator(mockJson),
    idsSegmentGenerator(mockJson),
    subSegmentGenerator(mockJson),
    offenceSegmentsCXU04(mockJson)
  ]

  return content.join("")
}

export default convertLedsSubsequentDisposalRequestToXmls
