import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import serialiseToXml from "../../../lib/serialise/ahoXml/serialiseToXml"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { ComparisonData } from "../../types/ComparisonData"
import { checkIntentionalDifferenceForPhases } from "./index"

// Core parses the offences TIC string more accurately so will now add it to the AHO

const extractOffencesTic = (aho: AnnotatedHearingOutcome): (number | undefined)[][] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.map((o) =>
    o.Result.map((r) => r.NumberOfOffencesTIC)
  )

const normaliseOffencesTic = (aho: AnnotatedHearingOutcome): AnnotatedHearingOutcome => {
  const clonedAho = JSON.parse(JSON.stringify(aho), dateReviver) as AnnotatedHearingOutcome
  clonedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((o) =>
    o.Result.forEach((r) => (r.NumberOfOffencesTIC = undefined))
  )
  return clonedAho
}

const fixedNumberOfOffencesTic = ({ expected, actual, phase }: ComparisonData) =>
  checkIntentionalDifferenceForPhases([1, 2], phase, (): boolean => {
    if (JSON.stringify(expected.courtResultMatchingSummary) !== JSON.stringify(actual.courtResultMatchingSummary)) {
      return false
    }

    if (serialiseToXml(normaliseOffencesTic(expected.aho)) !== serialiseToXml(normaliseOffencesTic(actual.aho))) {
      return false
    }

    const expectedOffencesTic = extractOffencesTic(expected.aho)
    const actualOffencesTic = extractOffencesTic(actual.aho)

    return JSON.stringify(expectedOffencesTic) !== JSON.stringify(actualOffencesTic)
  })

export default fixedNumberOfOffencesTic
