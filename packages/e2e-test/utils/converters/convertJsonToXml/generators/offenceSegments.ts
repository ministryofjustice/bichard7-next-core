import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import adjSegmentGenerator from "./adjSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import cofSegmentGenerator from "./cofSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

const offenceSegments = (ledsJson: MockAsnQueryResponse) => {
  const { updateType, disposals } = ledsJson

  const allSegments = disposals.flatMap((disposal) => {
    const ccr = ccrSegmentGenerator(updateType, disposal)

    const childSegments = disposal.offences.flatMap((offence) => {
      const cof = cofSegmentGenerator(updateType, offence)
      const adj = adjSegmentGenerator(offence.updateType, offence) ?? []
      const dis =
        offence.disposalResults?.map((disposalResult) => disSegmentGenerator(offence.updateType, disposalResult)) ?? []

      return [cof, adj, ...dis]
    })

    return [ccr, ...childSegments]
  })

  return allSegments.join("")
}

export default offenceSegments
