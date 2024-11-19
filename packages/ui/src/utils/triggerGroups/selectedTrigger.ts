import type { ReasonCode } from "types/CourtCaseFilter"

import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"

const selectedTrigger = (triggerCode: string, reasonCodes: ReasonCode[]): boolean =>
  !!reasonCodes.find((reasonCode) => getLongTriggerCode(reasonCode.value) === triggerCode)

export default selectedTrigger
