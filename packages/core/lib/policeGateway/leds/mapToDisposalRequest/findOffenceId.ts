import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

export const findOffenceId = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference: string | undefined,
  offenceSequenceNumber: string | undefined
): string => {
  const sequenceNumber = Number(offenceSequenceNumber)
  const courtCase = pncUpdateDataset.PncQuery?.courtCases?.find((c) => c.courtCaseReference === courtCaseReference)
  const offence = courtCase?.offences.find((o) => o.offence.sequenceNumber === sequenceNumber)

  return offence?.offence.offenceId ?? ""
}
