import type TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"

const resultCodeValues: Record<string, number[]> = {
  TRPR0002: [4575, 4576, 4577, 4585, 4586],
  TRPR0003: [
    1100, 1177, 1178, 3034, 3041, 3047, 3068, 3078, 3080, 3082, 3106, 3100, 3115, 3121, 3122, 3123, 3124, 3125, 3133,
    3284, 3285, 3288, 4590, 3324
  ],
  TRPR0003A: [1141, 1142, 1143],
  TRPR0003B: [3104, 3105, 3107],
  TRPR0004: [3052, 3081, 3085, 3086, 3087, 3088, 3089, 3090, 3091, 1179, 1181, 3281, 3282],
  TRPR0009: [],
  TRPR0010: [4597],
  TRPR0011: [1030, 1031, 1032],
  TRPR0015: [4592],
  TRPR0020: [1029, 1030, 1031, 1032, 3501],
  TRPR0025: [4584],
  TRPS0001: [],
  TRPR0025A: [3049]
}

const getResultCodeValuesForTriggerCode = (triggerCode: TriggerCode): number[] => {
  return resultCodeValues[triggerCode]
}

export default getResultCodeValuesForTriggerCode
