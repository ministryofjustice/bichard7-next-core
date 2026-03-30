import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import adjSegmentGenerator from "./adjSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import cofSegmentGenerator from "./cofSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

const offenceSegmentsCXE01 = (ledsJson: MockAsnQueryResponse): string => {
  const allSegments = ledsJson.disposals.flatMap((disposal) => {
    const ccr = ccrSegmentGenerator(disposal)

    const childSegments = disposal.offences.flatMap((offence) => {
      const cof = cofSegmentGenerator(offence)
      const adj = adjSegmentGenerator(offence) ?? []
      const dis = offence.disposalResults?.map((disposalResult) => disSegmentGenerator(disposalResult)) ?? []

      return [cof, adj, ...dis]
    })

    return [ccr, ...childSegments]
  })

  return allSegments.join("")
}

export default offenceSegmentsCXE01
