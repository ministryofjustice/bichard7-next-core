import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import { lookupRemandStatusByCjsCode } from "../../lib/dataLookup"
import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0010
const resultCode = 4597
const resultQualifier = "LI"
const pncRemandStatus = "C"

const hasBailConditions = (conditions: string[]): boolean => conditions.length > 0

const offenceHasResultCode = (offence: Offence): boolean =>
  offence.Result.some((result) => result.CJSresultCode === resultCode)

const offenceHasResultQualifier = (offence: Offence): boolean =>
  offence.Result.some((result) => result.ResultQualifierVariable.some((q) => q.Code === resultQualifier))

const hasMatchingOffence = (offences: Offence[]): boolean =>
  offences.some((offence) => offenceHasResultCode(offence) || offenceHasResultQualifier(offence))

const defendantInCustody = (remandStatus: string) =>
  lookupRemandStatusByCjsCode(remandStatus)?.pncCode === pncRemandStatus

const generator: TriggerGenerator = (hearingOutcome) => {
  const {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Case: {
          HearingDefendant: { Offence: offences, BailConditions: bailConditions, RemandStatus: remandStatus }
        }
      }
    }
  } = hearingOutcome

  if (!defendantInCustody(remandStatus) && (hasBailConditions(bailConditions) || hasMatchingOffence(offences))) {
    return [{ code: triggerCode }]
  }

  return []
}

export default generator
