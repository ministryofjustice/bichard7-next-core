import type { MockAddDisposalRequest } from "../../../types/MockAddDisposalRequest"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import { offenceSegmentsCXU02 } from "./generators/offenceSegmentsCXU02"

const convertLedsAddDisposalRequestToXml = (mockJson: MockAddDisposalRequest): string => {
  const content = [fscSegmentGenerator(mockJson), idsSegmentGenerator(mockJson), offenceSegmentsCXU02(mockJson)]

  return content.join("")
}

export default convertLedsAddDisposalRequestToXml
