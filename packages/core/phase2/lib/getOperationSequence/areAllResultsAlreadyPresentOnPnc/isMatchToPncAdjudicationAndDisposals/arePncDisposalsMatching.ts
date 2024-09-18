import type { PncDisposal } from "../../../../../types/PncQueryResult"

const areStringsEqual = (firstObject: string | undefined, secondObject: string | undefined) =>
  (!firstObject && !secondObject) || firstObject === secondObject

const arePncDisposalsMatching = (firstDisposal: PncDisposal, secondDisposal: PncDisposal): boolean =>
  firstDisposal.type === secondDisposal.type &&
  areStringsEqual(firstDisposal.qtyDuration, secondDisposal.qtyDuration) &&
  areStringsEqual(firstDisposal.qtyDate, secondDisposal.qtyDate) &&
  ((!firstDisposal.qtyMonetaryValue && !secondDisposal.qtyMonetaryValue) ||
    Number(firstDisposal.qtyMonetaryValue) === Number(secondDisposal.qtyMonetaryValue)) &&
  areStringsEqual(firstDisposal.qualifiers, secondDisposal.qualifiers) &&
  areStringsEqual(firstDisposal.text?.toUpperCase(), secondDisposal.text?.toUpperCase())

export default arePncDisposalsMatching
