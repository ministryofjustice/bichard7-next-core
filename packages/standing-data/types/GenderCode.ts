export enum GenderCode {
  NOT_KNOWN = 0,
  MALE = 1,
  FEMALE = 2,
  NOT_SPECIFIED = 9
}

export const GenderCodes: Record<GenderCode, string> = {
  [GenderCode.NOT_KNOWN]: "not known",
  [GenderCode.MALE]: "male",
  [GenderCode.FEMALE]: "female",
  [GenderCode.NOT_SPECIFIED]: "not specified"
}
