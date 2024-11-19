import { z } from "zod"
import type { Operation, PncUpdateDataset } from "../../types/PncUpdateDataset"

export const pncAsnUpdateFacadeBusinessExceptionSchema = z.object({})
export type PncAsnUpdateFacadeBusinessException = z.infer<typeof pncAsnUpdateFacadeBusinessExceptionSchema>

const handleBusinessException = (
  _pncUpdateDataset: PncUpdateDataset,
  _operation: Operation,
  _exception: PncAsnUpdateFacadeBusinessException
) => {
  // TODO: Implement PNCUpdateProcessor.java:119 if error type is PNCAsnUpdateFacadeBusinessException
}

export default handleBusinessException
