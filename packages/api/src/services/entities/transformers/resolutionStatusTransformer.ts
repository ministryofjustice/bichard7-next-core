import type { FindOperator, ValueTransformer } from "typeorm"
import resolveFindOperator from "../../../services/entities/transformers/resolveFindOperator"
import type { ResolutionStatus } from "../../../types/ResolutionStatus"

const resolutionStatusByCode: Record<number, ResolutionStatus> = {
  1: "Unresolved",
  2: "Resolved",
  3: "Submitted"
}

const getResolutionStatusCodeByText = (text: string) =>
  Object.keys(resolutionStatusByCode)
    .map((num) => Number(num))
    .find((code) => resolutionStatusByCode[code] === text)

const resolutionStatusTransformer: ValueTransformer = {
  from: (value: number) => {
    return resolutionStatusByCode[value]
  },
  to: (value: ResolutionStatus | FindOperator<ResolutionStatus>) => {
    return resolveFindOperator(value, (input) => getResolutionStatusCodeByText(input))
  }
}

export default resolutionStatusTransformer
