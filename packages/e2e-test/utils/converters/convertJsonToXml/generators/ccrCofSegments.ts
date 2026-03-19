import type { AsnQueryResponseExtended } from "../../../../types/AsnQueryResponseExtended"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import cofSegmentGenerator from "./cofSegmentGenerator"

const ccrCofSegments = (ledsJson: AsnQueryResponseExtended) => {
  const { updateType, disposals } = ledsJson

  const allSegments = disposals.flatMap((disposal) => {
    const ccr = ccrSegmentGenerator(updateType, disposal)

    const cofs = disposal.offences.map((offence) => cofSegmentGenerator(updateType, offence))

    return [ccr, ...cofs]
  })

  return allSegments.join("")
}

export default ccrCofSegments
