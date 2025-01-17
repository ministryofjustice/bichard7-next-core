export enum ResolutionStatus {
  Resolved = "Resolved",
  Submitted = "Submitted",
  Unresolved = "Unresolved"
}

export const resolutionStatusByCode: Record<number, ResolutionStatus> = {
  1: ResolutionStatus.Unresolved,
  2: ResolutionStatus.Resolved,
  3: ResolutionStatus.Submitted
}

export const resolutionStatusFromDb = (status: null | number): null | ResolutionStatus =>
  status ? resolutionStatusByCode[status] : null

export const resolutionStatusCodeByText = (text: string): number | undefined =>
  Object.keys(resolutionStatusByCode)
    .map((num) => Number(num))
    .find((code) => resolutionStatusByCode[code] === text)
