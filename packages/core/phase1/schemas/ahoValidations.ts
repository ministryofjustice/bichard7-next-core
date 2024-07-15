import { remandStatus } from "bichard7-next-data-latest"
import { z } from "zod"
import type { AmountSpecifiedInResult, NumberSpecifiedInResult } from "../../types/AnnotatedHearingOutcome"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
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
import { isAsnFormatValid, isAsnOrganisationUnitValid } from "../lib/isAsnValid"

const invalid = () => false

const validateRemandStatus = (data: string): boolean => remandStatus.some((el) => el.cjsCode === data)

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

const validateAsn = (data: string, ctx: z.RefinementCtx): void => {
  if (!isAsnFormatValid(data)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100206 })
  } else if (!isAsnOrganisationUnitValid(data)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100300 })
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
  validateActualOffenceDateCode,
  validateAmountSpecifiedInResult,
  validateAsn,
  validateCourtType,
  validateDurationType,
  validateDurationUnit,
  validateModeOfTrialReason,
  validateNumberSpecifiedInResult,
  validateOffenceCategory,
  validateOffenceInitiationCode,
  validateRemandStatus,
  validateResultClass,
  validateResultCode,
  validateResultQualifierCode,
  validateSummonsCode,
  validateTargetCourtType,
  validateTypeOfHearing,
  validateVehicleCode,
  validateVerdict,
  validateYesNo
}
