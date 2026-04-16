import type { MockSubsequentDisposalResultsRequest } from "../../../types/MockSubsequentDisposalResultsRequest"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import offenceSegmentsCXU04 from "./generators/offenceSegmentsCXU04"
import subSegmentGenerator from "./generators/subSegmentGenerator"

const convertLedsSubsequentDisposalRequestToXmls = (ledsJson: MockSubsequentDisposalResultsRequest): string => {
  const content = [
    fscSegmentGenerator(ledsJson),
    idsSegmentGenerator(ledsJson),
    subSegmentGenerator(ledsJson),
    offenceSegmentsCXU04(ledsJson)
  ]

  return content.join("")
}

export default convertLedsSubsequentDisposalRequestToXmls
