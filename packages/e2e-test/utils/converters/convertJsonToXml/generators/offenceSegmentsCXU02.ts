import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import achSegmentGenerator from "./achSegmentGenerator"
import { adjSegmentFromAddDisposalRequest } from "./adjSegment"
import asrSegmentGenerator from "./asrSegmentGenerator"
import cchSegmentGenerator from "./cchSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import couSegmentGenerator from "./couSegmentGenerator"
import crtSegmentGenerator from "./crtSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

export const offenceSegmentsCXU02 = (ledsJson: MockAddDisposalRequest): string => {
  const ccr = ccrSegmentGenerator(ledsJson)
  const cou = couSegmentGenerator(ledsJson)
  const crt = crtSegmentGenerator(ledsJson)

  const offences = ledsJson.offences?.flatMap((offence) => {
    const cch = cchSegmentGenerator(offence)
    const adj = adjSegmentFromAddDisposalRequest(offence)
    const dis = offence.disposalResults?.map((disposalResult) => disSegmentGenerator(disposalResult)) ?? []

    return [cch, adj, ...dis]
  })

  const additionalOffences = ledsJson.additionalArrestOffences?.flatMap((arrestOffences) => {
    const asr = asrSegmentGenerator(arrestOffences.asn, ledsJson.crimeOffenceReferenceNumber)

    const additionalArrestOffences = arrestOffences.additionalOffences.flatMap((offence) => {
      const ach = achSegmentGenerator(offence)
      const adj = adjSegmentFromAddDisposalRequest(offence)
      const dis = offence.disposalResults?.map((disposalResult) => disSegmentGenerator(disposalResult)) ?? []

      return [ach, adj, ...dis]
    })

    return [asr, ...additionalArrestOffences]
  })

  return [ccr, cou, crt, ...(offences ?? []), ...(additionalOffences ?? [])].join("")
}
