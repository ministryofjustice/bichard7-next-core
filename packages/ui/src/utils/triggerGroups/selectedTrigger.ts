import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import { ReasonCode } from "types/CourtCaseFilter"

const selectedTrigger = (triggerCode: string, reasonCodes: ReasonCode[]): boolean =>
  !!reasonCodes.find((reasonCode) => getLongTriggerCode(reasonCode.value) === triggerCode)

export default selectedTrigger
