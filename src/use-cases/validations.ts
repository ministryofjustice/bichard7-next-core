import { remandStatus } from "@moj-bichard7-developers/bichard7-next-data"
import ASN from "src/lib/asn"
import { ExceptionCode } from "src/types/ExceptionCode"
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
} from "./dataLookup"

const validateRemandStatus = (data: string): boolean => remandStatus.some((el) => el.cjsCode === data)

const validateASN = (data: string): boolean => {
  const asn = new ASN(data)
  return !!data.match(/[0-9]{2}[A-Z0-9]{6,7}[0-9]{11}[A-HJ-NP-RT-Z]{1}/) && asn.checkCharacter() === data.slice(-1)
}

const validateResultCode = (data: number, ctx: z.RefinementCtx): void => {
  if (data < 1000 || data > 9999) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100240 })
  } else if (!lookupResultCodeByCjsCode(data.toString())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: ExceptionCode.HO100307 })
  }
}

const validateCourtType = (data: string): boolean => !!lookupCourtTypeByCjsCode(data.toString())

const validateTypeOfHearing = (data: string): boolean => !!lookupTypeOfHearingByCjsCode(data.toString())

const validateVerdict = (data: string): boolean => !!lookupVerdictByCjsCode(data.toString())

const validateModeOfTrialReason = (data: string): boolean => !!lookupModeOfTrialReasonByCjsCode(data.toString())

const validateTargetCourtType = (data: string): boolean => !!lookupTargetCourtTypeByCjsCode(data.toString())

const validateResultClass = (data: string): boolean => !!lookupResultClassByCjsCode(data.toString())

const validateResultQualifierCode = (data: string): boolean => !!lookupResultQualifierCodeByCjsCode(data.toString())

const validateDurationUnit = (data: string): boolean => !!lookupDurationUnitByCjsCode(data.toString())

const validateDurationType = (data: string): boolean => !!lookupDurationTypeByCjsCode(data.toString())

const validateOffenceCategory = (data: string): boolean => !!lookupOffenceCategoryByCjsCode(data)

const validateOffenceInitiationCode = (data: string): boolean => !!lookupOffenceInitiationCodeByCjsCode(data)

const validateSummonsCode = (data: string): boolean => !!lookupSummonsCodeByCjsCode(data)

const validateActualOffenceDateCode = (data: string): boolean => !!lookupOffenceDateCodeByCjsCode(data)

const validateYesNo = (data: string): boolean => !!lookupYesNoByCjsCode(data)

const validateVehicleCode = (data: string): boolean => !!lookupVehicleCodeByCjsCode(data)

export {
  validateRemandStatus,
  validateASN,
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
  validateActualOffenceDateCode
}
