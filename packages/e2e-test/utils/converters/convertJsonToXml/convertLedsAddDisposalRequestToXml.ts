import type { MockAddDisposalRequest } from "../../../types/MockAddDisposalRequest"
import fscSegmentGenerator from "./generators/fscSegmentGenerator"
import idsSegmentGenerator from "./generators/idsSegmentGenerator"
import { offenceSegmentsCXU02 } from "./generators/offenceSegmentsCXU02"

const convertLedsAddDisposalRequestToXml = (ledsJson: MockAddDisposalRequest): string => {
  const content = [fscSegmentGenerator(ledsJson), idsSegmentGenerator(ledsJson), offenceSegmentsCXU02(ledsJson)]

  return content.join("")
}

export default convertLedsAddDisposalRequestToXml
