import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

export const findCourtCaseId = (
  pncUpdateDataset: PncUpdateDataset,
  courtCaseReference: string | undefined
): string | undefined => {
  const courtCase = pncUpdateDataset.PncQuery?.courtCases?.find((c) => c.courtCaseReference === courtCaseReference)

  return courtCase?.courtCaseId
}
