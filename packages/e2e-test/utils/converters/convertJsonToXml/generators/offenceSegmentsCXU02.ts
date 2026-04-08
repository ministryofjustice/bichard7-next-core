import type { ArrestOffence, Offence } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AdditionalArrestOffences } from "@moj-bichard7/core/types/leds/DisposalRequest"
import type { MockAddDisposalRequest } from "../../../../types/MockAddDisposalRequest"
import achSegmentGenerator from "./achSegmentGenerator"
import { adjSegmentFromAddDisposalRequest } from "./adjSegment"
import asrSegmentGenerator from "./asrSegmentGenerator"
import cchSegmentGenerator from "./cchSegmentGenerator"
import ccrSegmentGenerator from "./ccrSegmentGenerator"
import couSegmentGenerator from "./couSegmentGenerator"
import crtSegmentGenerator from "./crtSegmentGenerator"
import disSegmentGenerator from "./disSegmentGenerator"

const buildOffenceSegments = (offence: Offence): string[] => {
  const cch = cchSegmentGenerator(offence)
  const adj = adjSegmentFromAddDisposalRequest(offence) ?? ""
  const dis =
    offence.disposalResults?.flatMap((result) => {
      const segment = disSegmentGenerator(result)
      return segment ? [segment] : []
    }) ?? []

  return [cch, adj, ...dis]
}

const buildAdditionalArrestOffenceSegments = (arrestOffence: ArrestOffence): string[] => {
  const ach = achSegmentGenerator(arrestOffence)
  const adj = adjSegmentFromAddDisposalRequest(arrestOffence) ?? ""
  const dis =
    arrestOffence.disposalResults?.flatMap((disposalResult) => {
      const segment = disSegmentGenerator(disposalResult)
      return segment ? [segment] : []
    }) ?? []

  return [ach, adj, ...dis]
}

const buildAdditionalOffenceSegments = (
  additionalArrestOffence: AdditionalArrestOffences,
  crimeOffenceReferenceNumber: string
): string[] => {
  const asr = asrSegmentGenerator(additionalArrestOffence.asn, crimeOffenceReferenceNumber)
  const additionalOffences = additionalArrestOffence.additionalOffences.flatMap(buildAdditionalArrestOffenceSegments)

  return [asr, ...additionalOffences]
}

export const offenceSegmentsCXU02 = (ledsJson: MockAddDisposalRequest): string => {
  const headerSegments = [ccrSegmentGenerator(ledsJson), couSegmentGenerator(ledsJson), crtSegmentGenerator(ledsJson)]
  const offences = ledsJson.offences?.flatMap(buildOffenceSegments) ?? []
  const additionalOffences =
    ledsJson.additionalArrestOffences?.flatMap((additionalArrestOffence) =>
      buildAdditionalOffenceSegments(additionalArrestOffence, ledsJson.crimeOffenceReferenceNumber)
    ) ?? []

  return [...headerSegments, ...offences, ...additionalOffences].join("")
}
