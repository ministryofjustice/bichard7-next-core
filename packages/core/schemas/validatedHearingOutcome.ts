import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { z } from "zod"

import {
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
  validateResultCode,
  validateResultQualifierCode,
  validateSummonsCode,
  validateTargetCourtType,
  validateTypeOfHearing,
  validateVehicleCode,
  validateVerdict,
  validateYesNo
} from "./ahoValidations"
import toArray from "./toArray"
import {
  alcoholLevelSchema,
  amountSpecifiedInResultSchema,
  caseSchema,
  courtReferenceSchema,
  criminalProsecutionReferenceSchema,
  defendantDetailSchema,
  defendantOrOffenderSchema,
  hearingDefendantSchema,
  hearingSchema,
  numberSpecifiedInResultSchema,
  offenceSchema,
  organisationUnitSchema,
  personNameSchema,
  resultQualifierVariableSchema,
  resultSchema,
  unvalidatedHearingOutcomeSchema,
  urgentSchema
} from "./unvalidatedHearingOutcome"

export const validTimeSchema = z.string().regex(/(([0-1][0-9])|([2][0-3])):[0-5][0-9]/, ExceptionCode.HO100103)

export const validAlcoholLevelSchema = alcoholLevelSchema.extend({
  Amount: z.number().min(0, ExceptionCode.HO100237).max(999, ExceptionCode.HO100237)
})

export const validOrganisationUnitSchema = organisationUnitSchema.extend({
  OrganisationUnitCode: z.string().regex(/^[A-JZ0-9]{0,1}[A-Z0-9]{6}$/, ExceptionCode.HO100200)
})

export const validDefendantOrOffenderSchema = defendantOrOffenderSchema.extend({
  OrganisationUnitIdentifierCode: validOrganisationUnitSchema
})

export const validCriminalProsecutionReferenceSchema = criminalProsecutionReferenceSchema.extend({
  DefendantOrOffender: validDefendantOrOffenderSchema.optional(),
  OffenceReasonSequence: z
    .string()
    .regex(/^\d{1,3}$/, ExceptionCode.HO100228)
    .or(z.null())
    .optional()
})

export const validDurationSchema = z.object({
  DurationLength: z.number().min(1, ExceptionCode.HO100242).max(999, ExceptionCode.HO100242),
  DurationType: z.string().refine(validateDurationType, ExceptionCode.HO100108),
  DurationUnit: z.string().refine(validateDurationUnit, ExceptionCode.HO100108)
})

export const validResultQualifierVariableSchema = resultQualifierVariableSchema.extend({
  Code: z.string().superRefine(validateResultQualifierCode),
  Duration: validDurationSchema.optional()
})

export const validAddressLine = z.string().min(1, ExceptionCode.HO100217).max(35, ExceptionCode.HO100217)

export const validAddressSchema = z.object({
  AddressLine1: validAddressLine,
  AddressLine2: validAddressLine.optional(),
  AddressLine3: validAddressLine.optional(),
  AddressLine4: validAddressLine.optional(),
  AddressLine5: validAddressLine.optional()
})

export const validPersonNameSchema = personNameSchema.extend({
  FamilyName: z.string().min(1, ExceptionCode.HO100215).max(35, ExceptionCode.HO100215),
  GivenName: z.array(z.string().max(35, ExceptionCode.HO100213)).optional(),
  Title: z.string().max(35, ExceptionCode.HO100212).optional()
})

export const validDefendantDetailSchema = defendantDetailSchema.extend({
  PersonName: validPersonNameSchema
})

export const validCourtCaseReferenceNumberSchema = z
  .string()
  .regex(/^[0-9]{2}\/[0-9]{4}\/[0-9]{1,6}[A-HJ-NP-RT-Z]{1}$/i, ExceptionCode.HO100203)

export const validHearingSchema = hearingSchema.extend({
  CourtHearingLocation: validOrganisationUnitSchema,
  CourtHouseCode: z.number().min(100, ExceptionCode.HO100249).max(9999, ExceptionCode.HO100249),
  CourtType: z.string().or(z.null()).refine(validateCourtType, ExceptionCode.HO100108).optional(), // Can't test this in Bichard because it is always set to a valid value
  TimeOfHearing: validTimeSchema
})

export const validUrgentSchema = urgentSchema.extend({
  urgency: z.number().min(0, ExceptionCode.HO100109).max(999, ExceptionCode.HO100110)
})

export const validResultSchema = resultSchema.extend({
  AmountSpecifiedInResult: z
    .preprocess(
      toArray,
      amountSpecifiedInResultSchema.refine(validateAmountSpecifiedInResult, ExceptionCode.HO100243).array().min(0)
    )
    .optional(),
  BailCondition: z.string().min(1, ExceptionCode.HO100219).max(2500, ExceptionCode.HO100219).array().min(0).optional(),
  CJSresultCode: z.number().superRefine(validateResultCode),
  CourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid court so unable to test
  Duration: validDurationSchema.array().optional(),
  ModeOfTrialReason: z.string().refine(validateModeOfTrialReason, ExceptionCode.HO100108).optional(), // Tested in HO100108
  NextCourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid value
  NextHearingDate: z.date().or(z.string().refine(invalid, ExceptionCode.HO100102)).or(z.null()).optional(),
  NextHearingTime: validTimeSchema.optional(),
  NextHearingType: z.string().refine(validateTypeOfHearing, ExceptionCode.HO100108).optional(), // Never set
  NextResultSourceOrganisation: validOrganisationUnitSchema.or(z.null()).optional(),
  NumberSpecifiedInResult: z
    .array(numberSpecifiedInResultSchema.refine(validateNumberSpecifiedInResult, ExceptionCode.HO100244))
    .optional(),
  OffenceRemandStatus: z.string().refine(validateRemandStatus, ExceptionCode.HO100108).optional(), // Tested in HO100108
  PNCDisposalType: z.number().min(1000, ExceptionCode.HO100246).max(9999, ExceptionCode.HO100246).optional(),
  ReasonForOffenceBailConditions: z
    .string()
    .min(1, ExceptionCode.HO100106)
    .max(2500, ExceptionCode.HO100107)
    .optional(),
  ResultApplicableQualifierCode: z
    .string()
    .min(1, ExceptionCode.HO100241)
    .min(2, ExceptionCode.HO100241)
    .array()
    .min(0)
    .optional(),
  ResultHalfLifeHours: z.number().min(1, ExceptionCode.HO100109).max(999, ExceptionCode.HO100110).optional(), // Can't test because all values come from standing data
  ResultHearingType: z.string().refine(validateTypeOfHearing, ExceptionCode.HO100108).optional(), // Always set to OTHER so can't test exception
  ResultQualifierVariable: validResultQualifierVariableSchema.array().min(0),
  ResultVariableText: z.string().min(1, ExceptionCode.HO100245).max(2500, ExceptionCode.HO100245).optional(), // Can't test because it is masked by XML parser
  SourceOrganisation: validOrganisationUnitSchema,
  TargetCourtType: z.string().refine(validateTargetCourtType, ExceptionCode.HO100108).optional(), // Never set
  TimeSpecifiedInResult: validTimeSchema.optional(),
  Urgent: validUrgentSchema.optional(),
  Verdict: z.string().refine(validateVerdict, ExceptionCode.HO100108).optional() // Tested in HO100108
})

export const validOffenceSchema = offenceSchema.extend({
  ActualOffenceDateCode: z.string().refine(validateActualOffenceDateCode),
  ActualOffenceWording: z.string().min(1, ExceptionCode.HO100234).max(2500, ExceptionCode.HO100234),
  AlcoholLevel: validAlcoholLevelSchema.optional(),
  CommittedOnBail: z.string().refine(validateYesNo),
  CourtCaseReferenceNumber: validCourtCaseReferenceNumberSchema.or(z.null()).optional(),
  CourtOffenceSequenceNumber: z.number().min(0, ExceptionCode.HO100239).max(999, ExceptionCode.HO100239),
  CriminalProsecutionReference: validCriminalProsecutionReferenceSchema,
  HomeOfficeClassification: z
    .string()
    .regex(/^([0-9]{3})\/([0-9]{2})$/, ExceptionCode.HO100236)
    .optional(),
  LocationOfOffence: z.string().min(1, ExceptionCode.HO100232).max(80, ExceptionCode.HO100232).optional(),
  OffenceCategory: z.string().refine(validateOffenceCategory).optional(),
  OffenceEndTime: validTimeSchema.optional(),
  OffenceInitiationCode: z.string().refine(validateOffenceInitiationCode).optional(),
  OffenceTime: validTimeSchema.optional(),
  OffenceTitle: z.string().min(1, ExceptionCode.HO100233).max(120, ExceptionCode.HO100233).optional(),
  Result: validResultSchema.array().min(0),
  ResultHalfLifeHours: z.number().min(1).max(999).optional(),
  StartTime: validTimeSchema.optional(),
  SummonsCode: z.string().refine(validateSummonsCode).optional(),
  VehicleCode: z.string().refine(validateVehicleCode).optional(),
  VehicleRegistrationMark: z.string().min(11).max(11).optional()
})

export const validAsnSchema = z.string().superRefine(validateAsn)
export const validCroNumberSchema = z.string().regex(/[0-9]{1,6}\/[0-9]{2}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100207)
export const validDriverNumberSchema = z
  .string()
  .regex(/[A-Z0-9]{5}[0-9]{6}[A-Z0-9]{3}[A-Z]{2}/, ExceptionCode.HO100208)
export const validPncIdentifierSchema = z.string().regex(/[0-9]{4}\/[0-9]{7}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100209)

export const validHearingDefendantSchema = hearingDefendantSchema.extend({
  Address: validAddressSchema,
  ArrestSummonsNumber: validAsnSchema,
  CourtPNCIdentifier: validPncIdentifierSchema.optional(),
  CRONumber: validCroNumberSchema.optional(),
  DefendantDetail: validDefendantDetailSchema.optional(),
  DriverNumber: validDriverNumberSchema.optional(),
  Offence: validOffenceSchema.array().min(0),
  OrganisationName: z.string().min(1, ExceptionCode.HO100211).max(255, ExceptionCode.HO100211).optional(),
  PNCCheckname: z.string().max(54, ExceptionCode.HO100210).optional(),
  PNCIdentifier: validPncIdentifierSchema.optional(),
  ReasonForBailConditions: z.string().min(1, ExceptionCode.HO100220).max(2500, ExceptionCode.HO100220).optional(),
  RemandStatus: z.string().refine(validateRemandStatus, ExceptionCode.HO100108),
  Result: validResultSchema.optional()
})

export const validCaseSchema = caseSchema.extend({
  CaseMarker: z.string().min(0, ExceptionCode.HO100202).max(255, ExceptionCode.HO100202).optional(), // Note: This doesn't seem to ever be set in the original code
  CourtCaseReferenceNumber: validCourtCaseReferenceNumberSchema.optional(),
  CourtReference: courtReferenceSchema,
  CPSOrganisation: validOrganisationUnitSchema.optional(),
  ForceOwner: validOrganisationUnitSchema.optional(),
  HearingDefendant: validHearingDefendantSchema,
  PTIURN: z.string().regex(/^[A-Z0-9]{4}[0-9]{3,7}$/, ExceptionCode.HO100201),
  Urgent: validUrgentSchema.optional()
})

export const validHearingOutcomeSchema = z.object({
  Case: validCaseSchema,
  Hearing: validHearingSchema
})

export const validatedHearingOutcomeSchema = unvalidatedHearingOutcomeSchema.extend({
  AnnotatedHearingOutcome: z.object({
    HearingOutcome: validHearingOutcomeSchema
  })
})
