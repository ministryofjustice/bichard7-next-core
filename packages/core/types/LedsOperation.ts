import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

export const ledsOperations = {
  AsnQuery: "ASN Query",
  DisposalResults: "Disposal Results",
  Remand: "Remand",
  SentenceDeferred: "Sentence Deferred",
  SubsequentlyVaried: "Subsequently Varied"
} as const

type LedsOperation = (typeof ledsOperations)[keyof typeof ledsOperations]

type PncToLedsOperation = "AsnQuery" | Exclude<`${PncOperation}`, "PENHRG">

export const pncToLedsOperations: Record<PncToLedsOperation, LedsOperation> = {
  [PncOperation.DISPOSAL_UPDATED]: ledsOperations.SubsequentlyVaried,
  [PncOperation.NORMAL_DISPOSAL]: ledsOperations.DisposalResults,
  [PncOperation.REMAND]: ledsOperations.Remand,
  [PncOperation.SENTENCE_DEFERRED]: ledsOperations.SentenceDeferred,
  AsnQuery: ledsOperations.AsnQuery
} as const

export default LedsOperation
