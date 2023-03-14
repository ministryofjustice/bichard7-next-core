import { z } from "zod"
import {
  lookupCourtTypeByCjsCode,
  lookupDurationTypeByCjsCode,
  lookupDurationUnitByCjsCode,
  lookupModeOfTrialReasonByCjsCode,
  lookupOffenceCategoryByCjsCode,
  lookupOffenceDateCodeByCjsCode,
  lookupOffenceInitiationCodeByCjsCode,
  lookupResultClassByCjsCode,
  lookupResultCodeByCjsCode,
  lookupResultQualifierCodeByCjsCode,
  lookupSummonsCodeByCjsCode,
  lookupTargetCourtTypeByCjsCode,
  lookupTypeOfHearingByCjsCode,
  lookupVehicleCodeByCjsCode,
  lookupVerdictByCjsCode,
  lookupYesNoByCjsCode
} from "../dataLookup"
import Asn from "../lib/Asn"
import requireStandingData from "../lib/requireStandingData"
import type { AmountSpecifiedInResult, NumberSpecifiedInResult } from "../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../types/ExceptionCode"
const { remandStatus } = requireStandingData()

const invalid = () => false

const validateRemandStatus = (data: string): boolean => remandStatus.some((el) => el.cjsCode === data)

const validateAsn = (data: string): boolean => {
  const asn = new Asn(data)
  return !!data.match(/^[0-9]{2}[A-Z0-9]{6,7}[0-9]{11}[A-HJ-NP-RT-Z]{1}$/) && asn.checkCharacter() === data.slice(-1)
}

const validateResultCode = (data: number, ctx: z.RefinementCtx): void => {
  if (data < 1000 || data > 9999) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100240 })
  } else if (!lookupResultCodeByCjsCode(data.toString())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100307 })
  }
}

const validateCourtType = (data: string | null): boolean => !!data && !!lookupCourtTypeByCjsCode(data.toString())

const validateTypeOfHearing = (data: string): boolean => !!lookupTypeOfHearingByCjsCode(data.toString())

const validateVerdict = (data: string): boolean => !!lookupVerdictByCjsCode(data.toString())

const validateModeOfTrialReason = (data: string): boolean => !!lookupModeOfTrialReasonByCjsCode(data.toString())

const validateTargetCourtType = (data: string): boolean => !!lookupTargetCourtTypeByCjsCode(data.toString())

const validateResultClass = (data: string): boolean => !!lookupResultClassByCjsCode(data.toString())

const validateResultQualifierCode = (data: string, ctx: z.RefinementCtx): void => {
  if (data.length < 1 || data.length > 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100247 })
  } else if (!lookupResultQualifierCodeByCjsCode(data.toString())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100309 })
  }
}

const validateDurationUnit = (data: string): boolean => !!lookupDurationUnitByCjsCode(data.toString())

const validateDurationType = (data: string): boolean => !!lookupDurationTypeByCjsCode(data.toString())

const validateOffenceCategory = (data: string): boolean => !!lookupOffenceCategoryByCjsCode(data)

const validateOffenceInitiationCode = (data: string): boolean => !!lookupOffenceInitiationCodeByCjsCode(data)

const validateSummonsCode = (data: string): boolean => !!lookupSummonsCodeByCjsCode(data)

const validateActualOffenceDateCode = (data: string): boolean => !!lookupOffenceDateCodeByCjsCode(data)

const validateYesNo = (data: string): boolean => !!lookupYesNoByCjsCode(data)

const validateVehicleCode = (data: string): boolean => !!lookupVehicleCodeByCjsCode(data)

const validateAmountSpecifiedInResult = (elem: AmountSpecifiedInResult): boolean => {
  const maxAmount = 999999999999.99
  const minAmount = 0.01
  const fractionDigits = elem.Amount.toString().split(".")[1]?.length
  const totalDigits = elem.Amount.toString().replace(".", "").length

  return (
    elem.Amount >= minAmount &&
    elem.Amount <= maxAmount &&
    (fractionDigits === undefined || fractionDigits <= 2) &&
    totalDigits <= 14
  )
}

const validateNumberSpecifiedInResult = (value: NumberSpecifiedInResult): boolean =>
  value.Number >= 1 && value.Number <= 9999

export {
  invalid,
  validateRemandStatus,
  validateAsn,
  validateResultCode,
  validateCourtType,
  validateTypeOfHearing,
  validateVerdict,
  validateModeOfTrialReason,
  validateTargetCourtType,
  validateResultClass,
  validateResultQualifierCode,
  validateDurationUnit,
  validateDurationType,
  validateOffenceCategory,
  validateOffenceInitiationCode,
  validateSummonsCode,
  validateVehicleCode,
  validateYesNo,
  validateActualOffenceDateCode,
  validateAmountSpecifiedInResult,
  validateNumberSpecifiedInResult
}
