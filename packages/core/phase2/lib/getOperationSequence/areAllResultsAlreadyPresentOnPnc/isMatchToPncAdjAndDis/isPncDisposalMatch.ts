import type { PncDisposal } from "../../../../../types/PncQueryResult"

const areStringsEqual = (obj1: string | undefined, obj2: string | undefined) => (!obj1 && !obj2) || obj1 === obj2

const isPncDisposalMatch = (disA: PncDisposal, disB: PncDisposal): boolean =>
  disA.type === disB.type &&
  areStringsEqual(disA.qtyDuration, disB.qtyDuration) &&
  areStringsEqual(disA.qtyDate, disB.qtyDate) &&
  ((!disA.qtyMonetaryValue && !disB.qtyMonetaryValue) ||
    Number(disA.qtyMonetaryValue) === Number(disB.qtyMonetaryValue)) &&
  areStringsEqual(disA.qualifiers, disB.qualifiers) &&
  areStringsEqual(disA.text?.toUpperCase(), disB.text?.toUpperCase())

export default isPncDisposalMatch
