import type Phase from "../../types/Phase"
import type { ResultedCaseMessageParsedXml } from "../../types/SpiResult"

export type ProcessMessageOptions = {
  expectRecord?: boolean
  phase?: Phase
  pncAdjudication?: boolean
  pncCaseType?: string
  pncErrorMessage?: string
  pncMessage?: string
  pncOverrides?: Partial<ResultedCaseMessageParsedXml>
  recordable?: boolean
}
