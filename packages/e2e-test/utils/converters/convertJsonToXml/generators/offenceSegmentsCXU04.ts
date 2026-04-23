import type { MockSubsequentDisposalResultsRequest } from "../../../../types/MockSubsequentDisposalResultsRequest"
import cchSegmentGenerator from "./cchSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

const offenceSegmentsCXU04 = (mockJson: MockSubsequentDisposalResultsRequest): string => {
  const ccr = ccrSegmentGenerator(mockJson)

  const childSegments =
    mockJson.offences?.flatMap((offence) => {
      const cch = cchSegmentGenerator(offence)
      const dis = offence.disposalResults?.map((disposal) => disSegmentGenerator(disposal)) ?? []

      return [cch, ...dis]
    }) ?? []

  return [ccr, ...childSegments].join("")
}

export default offenceSegmentsCXU04
