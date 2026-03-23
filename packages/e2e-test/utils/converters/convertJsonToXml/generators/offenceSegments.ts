import type { AsnQueryResponseExtended } from "../../../../types/AsnQueryResponseExtended"
import adjSegmentGenerator from "./adjSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import cofSegmentGenerator from "./cofSegmentGenerator"

const offenceSegments = (ledsJson: AsnQueryResponseExtended) => {
  const { updateType, disposals } = ledsJson

  const allSegments = disposals.flatMap((disposal) => {
    const ccr = ccrSegmentGenerator(updateType, disposal)

    const cofAdj = disposal.offences.flatMap((offence) => {
      const cof = cofSegmentGenerator(updateType, offence)

      const hasAdj = offence.adjudications && offence.adjudications.length > 0
      const adj = hasAdj ? adjSegmentGenerator(updateType, offence) : ""

      return [cof, adj]
    })

    return [ccr, ...cofAdj]
  })

  return allSegments.join("")
}

export default offenceSegments
