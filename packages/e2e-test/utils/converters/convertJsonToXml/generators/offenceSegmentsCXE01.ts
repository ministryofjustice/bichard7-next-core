import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import { adjSegmentFromAsnQueryResponse } from "./adjSegment"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import cofSegmentGenerator from "./cofSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"
import pcrSegmentGenerator from "./pcrSegmentGenerator"

const offenceSegmentsCXE01 = (mockJson: MockAsnQueryResponse): string => {
  const allSegments = mockJson.disposals.flatMap((disposal) => {
    const headerSegment = disposal.penaltyCaseRefNo ? pcrSegmentGenerator(disposal) : ccrSegmentGenerator(disposal)

    const childSegments = disposal.offences.flatMap((offence) => {
      const cof = cofSegmentGenerator(offence)
      const adj = adjSegmentFromAsnQueryResponse(offence) ?? []
      const dis = offence.disposalResults?.map((disposalResult) => disSegmentGenerator(disposalResult)) ?? []

      return [cof, adj, ...dis]
    })

    return [headerSegment, ...childSegments]
  })

  return allSegments.join("")
}

export default offenceSegmentsCXE01
