import type { Result } from "../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../types/PncQueryResult"
import { createPncDisposalsFromResult } from "./createPncDisposalsFromResult"

const isResultMatchingAPncDisposal = (result: Result, pncDisposals: PncDisposal[]): boolean =>
  createPncDisposalsFromResult(result).every((ahoDisposal) =>
    pncDisposals.some((pncDisposal) => arePncDisposalsMatching(ahoDisposal, pncDisposal))
  )

const arePncDisposalsMatching = (firstDisposal: PncDisposal, secondDisposal: PncDisposal): boolean =>
  firstDisposal.type === secondDisposal.type &&
  areStringsEqual(firstDisposal.qtyDuration, secondDisposal.qtyDuration) &&
  areStringsEqual(firstDisposal.qtyDate, secondDisposal.qtyDate) &&
  ((!firstDisposal.qtyMonetaryValue && !secondDisposal.qtyMonetaryValue) ||
    Number(firstDisposal.qtyMonetaryValue) === Number(secondDisposal.qtyMonetaryValue)) &&
  areStringsEqual(firstDisposal.qualifiers, secondDisposal.qualifiers) &&
  areStringsEqual(firstDisposal.text?.toUpperCase(), secondDisposal.text?.toUpperCase())

const areStringsEqual = (firstObject: string | undefined, secondObject: string | undefined) =>
  (!firstObject && !secondObject) || firstObject === secondObject

export default isResultMatchingAPncDisposal
