import { ResolutionStatus, ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

export const resolutionStatusByCode: Record<number, ResolutionStatus> = {
  [ResolutionStatusNumber.Resolved]: ResolutionStatus.Resolved,
  [ResolutionStatusNumber.Submitted]: ResolutionStatus.Submitted,
  [ResolutionStatusNumber.Unresolved]: ResolutionStatus.Unresolved
}

export const resolutionStatusFromDb = (status: null | number): null | ResolutionStatus =>
  status ? resolutionStatusByCode[status] : null

export const resolutionStatusCodeByText = (text: string): number | undefined =>
  Object.keys(resolutionStatusByCode)
    .map((num) => Number(num))
    .find((code) => resolutionStatusByCode[code] === text)
