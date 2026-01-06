import type { FindOperator, ValueTransformer } from "typeorm"

import { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"

import resolveFindOperator from "./resolveFindOperator"

const resolutionStatusByCode: Record<number, ResolutionStatus> = {
  1: ResolutionStatus.Unresolved,
  2: ResolutionStatus.Resolved,
  3: ResolutionStatus.Submitted
}

const getResolutionStatusCodeByText = (text: string) =>
  Object.keys(resolutionStatusByCode)
    .map((num) => Number(num))
    .find((code) => resolutionStatusByCode[code] === text)

const resolutionStatusTransformer: ValueTransformer = {
  from: (value: number) => {
    return resolutionStatusByCode[value] ?? null
  },
  to: (value: ResolutionStatus | FindOperator<ResolutionStatus>) => {
    return resolveFindOperator(value, (input) => getResolutionStatusCodeByText(input))
  }
}

export default resolutionStatusTransformer
