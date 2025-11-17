import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceDisposal } from "@moj-bichard7/common/types/PoliceQueryResult"

import { createPoliceDisposalsFromResult } from "../../lib/results/createPoliceDisposalsFromResult"

const isResultMatchingAPoliceDisposal = (result: Result, policeDisposals: PoliceDisposal[]): boolean =>
  createPoliceDisposalsFromResult(result).every((ahoDisposal) =>
    policeDisposals.some((policeDisposal) => arePoliceDisposalsMatching(ahoDisposal, policeDisposal))
  )

const arePoliceDisposalsMatching = (firstDisposal: PoliceDisposal, secondDisposal: PoliceDisposal): boolean =>
  firstDisposal.type === secondDisposal.type &&
  areStringsEqual(firstDisposal.qtyDuration, secondDisposal.qtyDuration) &&
  areStringsEqual(firstDisposal.qtyDate, secondDisposal.qtyDate) &&
  ((!firstDisposal.qtyMonetaryValue && !secondDisposal.qtyMonetaryValue) ||
    Number(firstDisposal.qtyMonetaryValue) === Number(secondDisposal.qtyMonetaryValue)) &&
  areStringsEqual(firstDisposal.qualifiers?.trim(), secondDisposal.qualifiers?.trim()) &&
  areStringsEqual(firstDisposal.text?.toUpperCase(), secondDisposal.text?.toUpperCase())

const areStringsEqual = (firstObject: string | undefined, secondObject: string | undefined) =>
  (!firstObject && !secondObject) || firstObject === secondObject

export default isResultMatchingAPoliceDisposal
