import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import type { MockAsnQueryResponse } from "../../../../types/MockAsnQueryResponse"
import adjSegmentGenerator from "./adjSegmentGenerator"
import cchSegmentGenerator from "./cchSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import cofSegmentGenerator from "./cofSegmentGenerator"
import couSegmentGenerator from "./couSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

const offenceSegments = (ledsJson: MockAsnQueryResponse): string => {
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

export default offenceSegments

export const offenceSegmentsCXU02 = (ledsJson: MockAddDisposalRequest): string => {
  const ccr = ccrSegmentGenerator(ledsJson)
  const cou = couSegmentGenerator(ledsJson)

  const childSegments = ledsJson.offences?.flatMap((offence) => {
    const cch = cchSegmentGenerator(offence)
    const adj = adjSegmentGenerator(offence)
    const dis = offence.disposalResults?.map((disposalResult) => disSegmentGenerator(disposalResult)) ?? []

    return [cch, adj, ...dis]
  })

  return [ccr, cou, ...(childSegments ?? [])].join("")
}
