import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import adjSegmentGenerator from "./adjSegmentGenerator"
import cchSegmentGenerator from "./cchSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import couSegmentGenerator from "./couSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

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
