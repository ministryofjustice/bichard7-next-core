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
import rccSegmentGenerator from "./rccSegmentGenerator"

const buildBaseOffenceSegments = (offence: Offence | ArrestOffence, primarySegment: string): string[] => {
  const adj = adjSegmentFromAddDisposalRequest(offence) ?? ""
  const dis =
    offence.disposalResults?.flatMap((result) => {
      const segment = disSegmentGenerator(result)
      return segment ? [segment] : []
    }) ?? []

  return [primarySegment, adj, ...dis]
}

const buildOffenceSegments = (offence: Offence): string[] =>
  buildBaseOffenceSegments(offence, cchSegmentGenerator(offence))

const buildAdditionalOffenceSegments = (
  additionalArrestOffence: AdditionalArrestOffences,
  crimeOffenceReferenceNumber: string
): string[] => {
  const asr = asrSegmentGenerator(additionalArrestOffence.asn, crimeOffenceReferenceNumber)
  const additionalOffences = additionalArrestOffence.additionalOffences.flatMap((arrestOffence) =>
    buildBaseOffenceSegments(arrestOffence, achSegmentGenerator(arrestOffence))
  )

  return [asr, ...additionalOffences]
}

export const offenceSegmentsCXU02 = (mockJson: MockAddDisposalRequest): string => {
  const headerSegments = [
    ccrSegmentGenerator(mockJson),
    couSegmentGenerator(mockJson),
    rccSegmentGenerator(mockJson),
    crtSegmentGenerator(mockJson)
  ]
  const offences = mockJson.offences?.flatMap(buildOffenceSegments) ?? []
  const additionalOffences =
    mockJson.additionalArrestOffences?.flatMap((additionalArrestOffence) =>
      buildAdditionalOffenceSegments(additionalArrestOffence, mockJson.crimeOffenceReferenceNumber)
    ) ?? []

  return [...headerSegments, ...offences, ...additionalOffences].join("")
}
