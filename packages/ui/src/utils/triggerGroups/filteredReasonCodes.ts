import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getLongTriggerCode from "services/entities/transformers/getLongTriggerCode"
import { ReasonCode } from "types/CourtCaseFilter"

const filteredReasonCodes = (allGrpTriggerCodes: TriggerCode[], reasonCodes: ReasonCode[]) => {
  return reasonCodes.filter((reasonCode) => {
    const validTriggerCode = TriggerCode[getLongTriggerCode(reasonCode.value) as keyof typeof TriggerCode]

    return allGrpTriggerCodes.includes(validTriggerCode)
  })
}

export default filteredReasonCodes
