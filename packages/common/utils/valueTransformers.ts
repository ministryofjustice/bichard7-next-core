import type { Duration } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"

import pleaStatus from "@moj-bichard7-developers/bichard7-next-data/dist/data/plea-status.json"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"
import { Durations } from "@moj-bichard7-developers/bichard7-next-data/dist/types/Duration"
import { addDays, addHours, addMonths, addWeeks, addYears } from "date-fns"

export const capitalizeString = (str = ""): string => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}

export const getYesOrNo = (code: boolean | undefined) => {
  return code === true ? "Yes" : code === false ? "No" : undefined
}

export const capitaliseExpression = (expression: string) => {
  return expression.charAt(0).toUpperCase() + expression.slice(1).toLowerCase()
}

export const getUrgentYesOrNo = (urgent: boolean | undefined): string => {
  return urgent === true ? "Yes" : "No"
}

export const getNumberOfHours = (hours: number | undefined): string | undefined => {
  return hours ? `${hours} Hours` : undefined
}

const getDurationInMonths = (durationLength: number, durationUnit: string): number => {
  let durationLengthInMonths
  switch (durationUnit) {
    case "D":
      durationLengthInMonths = durationLength / 30
      break
    case "H":
      durationLengthInMonths = durationLength / 720
      break
    case "M":
      durationLengthInMonths = durationLength
      break
    case "W":
      durationLengthInMonths = durationLength / 4
      break
    case "Y":
      durationLengthInMonths = durationLength * 12
      break
    default:
      throw new Error(`Unsupported duration unit: ${durationUnit}`)
  }

  return Math.round(durationLengthInMonths)
}

export const formatDuration = (durationLength: number, durationUnit: string, forceMonths: boolean = false): string => {
  if (forceMonths) {
    return `${getDurationInMonths(durationLength, durationUnit)} ${Durations["M"]}`
  }

  return `${durationLength} ${Durations[durationUnit as Duration]}`
}

export const addDurationToDate = (date: Date, durationLength: number, durationUnit: string): Date => {
  let updatedDate = date
  switch (durationUnit) {
    case "D":
      updatedDate = addDays(date, durationLength)
      break
    case "H":
      updatedDate = addHours(date, durationLength)
      break
    case "M":
      updatedDate = addMonths(date, durationLength)
      break
    case "W":
      updatedDate = addWeeks(date, durationLength)
      break
    case "Y":
      updatedDate = addYears(date, durationLength)
      break
    default:
      throw new Error(`Unsupported duration unit: ${durationUnit}`)
  }

  return updatedDate
}

export const getPleaStatus = (pleaCode: string | undefined) => {
  let pleaStatusDescription = pleaCode
  pleaStatus.forEach((plea) => {
    if (plea.cjsCode === pleaCode) {
      pleaStatusDescription = `${pleaCode} (${capitaliseExpression(plea.description)})`
    }
  })
  return pleaStatusDescription
}

export const getVerdict = (verdictCode: string | undefined) => {
  let verdictDescription = verdictCode
  verdicts.forEach((verdict) => {
    if (verdict.cjsCode === verdictCode) {
      verdictDescription = `${verdictCode} (${capitaliseExpression(verdict.description)})`
    }
  })
  return verdictDescription
}
