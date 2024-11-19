import type { Operation } from "../../types/PncUpdateDataset"

import { PncOperation } from "../../types/PncOperation"

export const courtCaseSpecificOperations = [
  PncOperation.SENTENCE_DEFERRED,
  PncOperation.NORMAL_DISPOSAL,
  PncOperation.DISPOSAL_UPDATED
]

const getCourtCaseReferenceFromOperation = (operation: Operation): string | undefined =>
  courtCaseSpecificOperations.includes(operation.code) && operation.data && "courtCaseReference" in operation.data
    ? operation.data.courtCaseReference
    : undefined

export default getCourtCaseReferenceFromOperation
