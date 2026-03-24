import type { AsnQueryResponseExtended } from "../../../../types/AsnQueryResponseExtended"
import adjSegmentGenerator from "./adjSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import cofSegmentGenerator from "./cofSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

const offenceSegments = (ledsJson: AsnQueryResponseExtended) => {
  const { updateType, disposals } = ledsJson

  const allSegments = disposals.flatMap((disposal) => {
    const ccr = ccrSegmentGenerator(updateType, disposal)

    const cofAdjDis = disposal.offences.flatMap((offence) => {
      const cof = cofSegmentGenerator(updateType, offence)

      const hasAdj = (offence.adjudications?.length ?? 0) > 0
      const adj = hasAdj ? adjSegmentGenerator(offence.updateType, offence) : ""

      const dis =
        offence.disposalResults?.map((disposalResult) => disSegmentGenerator(offence.updateType, disposalResult)) ?? []

      return [cof, adj, ...dis]
    })

    return [ccr, ...cofAdjDis]
  })

  return allSegments.join("")
}

export default offenceSegments
