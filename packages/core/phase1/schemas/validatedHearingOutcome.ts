import { z } from "zod"
import { ExceptionCode } from "../../types/ExceptionCode"
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
  DurationType: z.string().refine(validateDurationType, ExceptionCode.HO100108),
  DurationUnit: z.string().refine(validateDurationUnit, ExceptionCode.HO100108),
  DurationLength: z.number().min(1, ExceptionCode.HO100242).max(999, ExceptionCode.HO100242)
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
  Title: z.string().max(35, ExceptionCode.HO100212).optional(),
  GivenName: z.array(z.string().max(35, ExceptionCode.HO100213)).optional(),
  FamilyName: z.string().min(1, ExceptionCode.HO100215).max(35, ExceptionCode.HO100215)
})

export const validDefendantDetailSchema = defendantDetailSchema.extend({
  PersonName: validPersonNameSchema
})

export const validCourtCaseReferenceNumberSchema = z
  .string()
  .regex(/^[0-9]{2}\/[0-9]{4}\/[0-9]{1,6}[A-HJ-NP-RT-Z]{1}$/i, ExceptionCode.HO100203)

export const validHearingSchema = hearingSchema.extend({
  CourtHearingLocation: validOrganisationUnitSchema,
  TimeOfHearing: validTimeSchema,
  CourtType: z.string().or(z.null()).refine(validateCourtType, ExceptionCode.HO100108).optional(), // Can't test this in Bichard because it is always set to a valid value
  CourtHouseCode: z.number().min(100, ExceptionCode.HO100249).max(9999, ExceptionCode.HO100249)
})

export const validUrgentSchema = urgentSchema.extend({
  urgency: z.number().min(0, ExceptionCode.HO100109).max(999, ExceptionCode.HO100110)
})

export const validResultSchema = resultSchema.extend({
  CJSresultCode: z.number().superRefine(validateResultCode),
  OffenceRemandStatus: z.string().refine(validateRemandStatus, ExceptionCode.HO100108).optional(), // Tested in HO100108
  SourceOrganisation: validOrganisationUnitSchema,
  CourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid court so unable to test
  ResultHearingType: z.string().refine(validateTypeOfHearing, ExceptionCode.HO100108).optional(), // Always set to OTHER so can't test exception
  Duration: validDurationSchema.array().optional(),
  TimeSpecifiedInResult: validTimeSchema.optional(),
  AmountSpecifiedInResult: z
    .preprocess(
      toArray,
      amountSpecifiedInResultSchema.refine(validateAmountSpecifiedInResult, ExceptionCode.HO100243).array().min(0)
    )
    .optional(),
  NumberSpecifiedInResult: z
    .array(numberSpecifiedInResultSchema.refine(validateNumberSpecifiedInResult, ExceptionCode.HO100244))
    .optional(),
  NextResultSourceOrganisation: validOrganisationUnitSchema.or(z.null()).optional(),
  NextHearingType: z.string().refine(validateTypeOfHearing, ExceptionCode.HO100108).optional(), // Never set
  NextHearingDate: z.date().or(z.string().refine(invalid, ExceptionCode.HO100102)).or(z.null()).optional(),
  NextHearingTime: validTimeSchema.optional(),
  NextCourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid value
  Verdict: z.string().refine(validateVerdict, ExceptionCode.HO100108).optional(), // Tested in HO100108
  ResultVariableText: z.string().min(1, ExceptionCode.HO100245).max(2500, ExceptionCode.HO100245).optional(), // Can't test because it is masked by XML parser
  TargetCourtType: z.string().refine(validateTargetCourtType, ExceptionCode.HO100108).optional(), // Never set
  ModeOfTrialReason: z.string().refine(validateModeOfTrialReason, ExceptionCode.HO100108).optional(), // Tested in HO100108
  PNCDisposalType: z.number().min(1000, ExceptionCode.HO100246).max(9999, ExceptionCode.HO100246).optional(),
  ReasonForOffenceBailConditions: z
    .string()
    .min(1, ExceptionCode.HO100106)
    .max(2500, ExceptionCode.HO100107)
    .optional(),
  ResultQualifierVariable: validResultQualifierVariableSchema.array().min(0),
  ResultHalfLifeHours: z.number().min(1, ExceptionCode.HO100109).max(999, ExceptionCode.HO100110).optional(), // Can't test because all values come from standing data
  Urgent: validUrgentSchema.optional(),
  ResultApplicableQualifierCode: z
    .string()
    .min(1, ExceptionCode.HO100241)
    .min(2, ExceptionCode.HO100241)
    .array()
    .min(0)
    .optional(),
  BailCondition: z.string().min(1, ExceptionCode.HO100219).max(2500, ExceptionCode.HO100219).array().min(0).optional()
})

export const validOffenceSchema = offenceSchema.extend({
  CriminalProsecutionReference: validCriminalProsecutionReferenceSchema,
  OffenceCategory: z.string().refine(validateOffenceCategory).optional(),
  OffenceInitiationCode: z.string().refine(validateOffenceInitiationCode).optional(),
  OffenceTitle: z.string().min(1, ExceptionCode.HO100233).max(120, ExceptionCode.HO100233).optional(),
  SummonsCode: z.string().refine(validateSummonsCode).optional(),
  ActualOffenceDateCode: z.string().refine(validateActualOffenceDateCode),
  LocationOfOffence: z.string().min(1, ExceptionCode.HO100232).max(80, ExceptionCode.HO100232).optional(),
  ActualOffenceWording: z.string().min(1, ExceptionCode.HO100234).max(2500, ExceptionCode.HO100234),
  AlcoholLevel: validAlcoholLevelSchema.optional(),
  VehicleCode: z.string().refine(validateVehicleCode).optional(),
  VehicleRegistrationMark: z.string().min(11).max(11).optional(),
  StartTime: validTimeSchema.optional(),
  OffenceEndTime: validTimeSchema.optional(),
  OffenceTime: validTimeSchema.optional(),
  CommittedOnBail: z.string().refine(validateYesNo),
  CourtCaseReferenceNumber: validCourtCaseReferenceNumberSchema.or(z.null()).optional(),
  CourtOffenceSequenceNumber: z.number().min(0, ExceptionCode.HO100239).max(999, ExceptionCode.HO100239),
  Result: validResultSchema.array().min(0),
  HomeOfficeClassification: z
    .string()
    .regex(/^([0-9]{3})\/([0-9]{2})$/, ExceptionCode.HO100236)
    .optional(),
  ResultHalfLifeHours: z.number().min(1).max(999).optional()
})

export const validAsnSchema = z.string().superRefine(validateAsn)
export const validCroNumberSchema = z.string().regex(/[0-9]{1,6}\/[0-9]{2}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100207)
export const validDriverNumberSchema = z
  .string()
  .regex(/[A-Z0-9]{5}[0-9]{6}[A-Z0-9]{3}[A-Z]{2}/, ExceptionCode.HO100208)
export const validPncIdentifierSchema = z.string().regex(/[0-9]{4}\/[0-9]{7}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100209)

export const validHearingDefendantSchema = hearingDefendantSchema.extend({
  ArrestSummonsNumber: validAsnSchema,
  DriverNumber: validDriverNumberSchema.optional(),
  CRONumber: validCroNumberSchema.optional(),
  PNCIdentifier: validPncIdentifierSchema.optional(),
  PNCCheckname: z.string().max(54, ExceptionCode.HO100210).optional(),
  DefendantDetail: validDefendantDetailSchema.optional(),
  Address: validAddressSchema,
  RemandStatus: z.string().refine(validateRemandStatus, ExceptionCode.HO100108),
  ReasonForBailConditions: z.string().min(1, ExceptionCode.HO100220).max(2500, ExceptionCode.HO100220).optional(),
  CourtPNCIdentifier: validPncIdentifierSchema.optional(),
  OrganisationName: z.string().min(1, ExceptionCode.HO100211).max(255, ExceptionCode.HO100211).optional(),
  Offence: validOffenceSchema.array().min(0),
  Result: validResultSchema.optional()
})

export const validCaseSchema = caseSchema.extend({
  PTIURN: z.string().regex(/^[A-Z0-9]{4}[0-9]{3,7}$/, ExceptionCode.HO100201),
  CaseMarker: z.string().min(0, ExceptionCode.HO100202).max(255, ExceptionCode.HO100202).optional(), // Note: This doesn't seem to ever be set in the original code
  CPSOrganisation: validOrganisationUnitSchema.optional(),
  CourtCaseReferenceNumber: validCourtCaseReferenceNumberSchema.optional(),
  CourtReference: courtReferenceSchema,
  ForceOwner: validOrganisationUnitSchema.optional(),
  HearingDefendant: validHearingDefendantSchema,
  Urgent: validUrgentSchema.optional()
})

export const validHearingOutcomeSchema = z.object({
  Hearing: validHearingSchema,
  Case: validCaseSchema
})

export const validatedHearingOutcomeSchema = unvalidatedHearingOutcomeSchema.extend({
  AnnotatedHearingOutcome: z.object({
    HearingOutcome: validHearingOutcomeSchema
  })
})
