import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import exponential from "@stdlib/random-base-exponential"
import sampleMany from "@stdlib/random-sample"
import { sample as sampleOne } from "lodash"
import {
  HO100206,
  HO100212,
  HO100234,
  HO100301,
  HO100302,
  HO100304,
  HO100306,
  HO100310,
  HO100314,
  HO100321,
  HO100322,
  HO100323,
  HO100325,
  HO100402,
  HO100404
} from "./exceptions"

const possibleExceptions: Record<string, (aho: AnnotatedHearingOutcome) => AnnotatedHearingOutcome> = {
  HO100206: (aho) => HO100206(aho),
  HO100212: (aho) => HO100212(aho),
  HO100234: (aho) => HO100234(aho),
  HO100301: (aho) => HO100301(aho),
  HO100302: (aho) => HO100302(aho),
  HO100304: (aho) => HO100304(aho),
  HO100306: (aho) => HO100306(aho),
  HO100310: (aho) => HO100310(aho),
  HO100314: (aho) => HO100314(aho),
  HO100321: (aho) => HO100321(aho),
  HO100322: (aho) => HO100322(aho),
  HO100323: (aho) => HO100323(aho),
  HO100324: (aho) => HO100234(aho),
  HO100325: (aho) => HO100325(aho),
  HO100402: (aho) => HO100402(aho),
  HO100404: (aho) => HO100404(aho)
}
const fields = [
  "ArrestSummonsNumber",
  "OffenceReasonSequence",
  "ActualOffenceWording",
  "ResultClass",
  "Reason",
  "NextHearingDate",
  "OrganisationUnitCode"
]

export default (
  hasTriggers: boolean,
  aho: AnnotatedHearingOutcome
): {
  errorReason: string
  errorReport: string
  exceptionCount: number
  ahoWithExceptions?: AnnotatedHearingOutcome
} => {
  if (hasTriggers && Math.random() > 0.5) {
    return { errorReason: "", errorReport: "", exceptionCount: 0 }
  }

  const numExceptions = Math.min(Math.round(exponential(2) * 2), 5) + 1
  const exceptions = sampleMany(Object.keys(possibleExceptions), { size: numExceptions })

  exceptions.forEach((exception) => {
    aho = possibleExceptions[exception](aho)
  })

  return {
    errorReport: exceptions.map((exception) => `${exception}||br7:${sampleOne(fields)}`).join(", "),
    errorReason: exceptions[0],
    exceptionCount: exceptions.length,
    ahoWithExceptions: aho
  }
}
