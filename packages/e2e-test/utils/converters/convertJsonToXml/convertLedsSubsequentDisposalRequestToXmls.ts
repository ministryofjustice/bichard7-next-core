import type { MockSubsequentDisposalResultsRequest } from "../../../types/MockSubsequentDisposalResultsRequest"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import subSegmentGenerator from "./generators/subSegmentGenerator"

const convertLedsSubsequentDisposalRequestToXmls = (ledsJson: MockSubsequentDisposalResultsRequest): string => {
  const content = [fscSegmentGenerator(ledsJson), idsSegmentGenerator(ledsJson), subSegmentGenerator(ledsJson)]

  return content.join("")
}

export default convertLedsSubsequentDisposalRequestToXmls
