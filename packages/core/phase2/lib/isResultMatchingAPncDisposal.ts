import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceDisposal } from "@moj-bichard7/common/types/PoliceQueryResult"

import { createPoliceDisposalsFromResult } from "../../lib/results/createPoliceDisposalsFromResult"

const isResultMatchingAPncDisposal = (result: Result, pncDisposals: PoliceDisposal[]): boolean =>
  createPoliceDisposalsFromResult(result).every((ahoDisposal) =>
    pncDisposals.some((pncDisposal) => arePncDisposalsMatching(ahoDisposal, pncDisposal))
  )

const arePncDisposalsMatching = (firstDisposal: PoliceDisposal, secondDisposal: PoliceDisposal): boolean =>
  firstDisposal.type === secondDisposal.type &&
  areStringsEqual(firstDisposal.qtyDuration, secondDisposal.qtyDuration) &&
  areStringsEqual(firstDisposal.qtyDate, secondDisposal.qtyDate) &&
  ((!firstDisposal.qtyMonetaryValue && !secondDisposal.qtyMonetaryValue) ||
    Number(firstDisposal.qtyMonetaryValue) === Number(secondDisposal.qtyMonetaryValue)) &&
  areStringsEqual(firstDisposal.qualifiers?.trim(), secondDisposal.qualifiers?.trim()) &&
  areStringsEqual(firstDisposal.text?.toUpperCase(), secondDisposal.text?.toUpperCase())

const areStringsEqual = (firstObject: string | undefined, secondObject: string | undefined) =>
  (!firstObject && !secondObject) || firstObject === secondObject

export default isResultMatchingAPncDisposal
