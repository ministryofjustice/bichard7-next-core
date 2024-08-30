import { Durations } from "@moj-bichard7-developers/bichard7-next-data/dist/types/Duration"
import { Duration } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import pleaStatus from "@moj-bichard7-developers/bichard7-next-data/dist/data/plea-status.json"
import verdicts from "@moj-bichard7-developers/bichard7-next-data/dist/data/verdict.json"

export const capitalizeString = (str = ""): string => {
  return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}

export const getYesOrNo = (code: boolean | undefined) => {
  return code === true ? "Y" : code === false ? "N" : undefined
}

export const capitaliseExpression = (expression: string) => {
  return expression.charAt(0).toUpperCase() + expression.slice(1).toLowerCase()
}

export const getUrgentYesOrNo = (urgent: boolean | undefined): string => {
  return urgent === true ? "Y" : "N"
}

export const getNumberOfHours = (hours: number | undefined): string | undefined => {
  return hours ? `${hours} Hours` : undefined
}

export const formatDuration = (durationLength: number, durationUnit: string): string => {
  return `${durationLength} ${Durations[durationUnit as Duration]}`
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
