import type { ResultedCaseMessageParsedXml } from "@moj-bichard7/common/types/SpiResult"

import type Phase from "../../types/Phase"

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
