import type { PncDisposal } from "../types/PncQueryResult"

const isPncDisposalMatch = (disA: PncDisposal, disB: PncDisposal): boolean =>
  disA.type === disB.type &&
  disA.qtyDuration === disB.qtyDuration &&
  disA.qtyDate === disB.qtyDate &&
  ((!disA.qtyMonetaryValue && !disB.qtyMonetaryValue) ||
    Number(disA.qtyMonetaryValue) === Number(disB.qtyMonetaryValue)) &&
  disA.qualifiers === disB.qualifiers &&
  disA.text?.toUpperCase() === disB.text?.toUpperCase()

export default isPncDisposalMatch
