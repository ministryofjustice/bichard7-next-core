import { ResultClass } from "src/lib/properties"
import { ExceptionCode } from "src/types/ExceptionCode"
import { CjsPlea } from "src/types/Plea"
import {
  validateActualOffenceDateCode,
  validateAmountSpecifiedInResult,
  validateCourtType,
  validateDurationType,
  validateDurationUnit,
  validateModeOfTrialReason,
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
} from "src/use-cases/validations"
import { z } from "zod"
import { exceptionSchema } from "./exception"
import { pncQueryResultSchema } from "./pncQueryResult"

export const timeSchema = z.string().regex(/(([0-1][0-9])|([2][0-3])):[0-5][0-9]/, ExceptionCode.HO100103)

export const alcoholLevelSchema = z.object({
  Amount: z.number().min(0, ExceptionCode.HO100237).max(999, ExceptionCode.HO100237),
  Method: z.string()
})

export const actualOffenceEndDateSchema = z.object({
  EndDate: z.date()
})

export const actualOffenceStartDateSchema = z.object({
  StartDate: z.date()
})

export const localOffenceCodeSchema = z.object({
  AreaCode: z.string(),
  OffenceCode: z.string()
})

export const offenceCodeSchema = z.discriminatedUnion("__type", [
  z.object({
    __type: z.literal("NonMatchingOffenceCode"),
    ActOrSource: z.string(),
    Year: z.string().optional(),
    Reason: z.string(),
    Qualifier: z.string().optional(),
    FullCode: z.string()
  }),
  z.object({
    __type: z.literal("CommonLawOffenceCode"),
    CommonLawOffence: z.string(),
    Reason: z.string(),
    Qualifier: z.string().optional(),
    FullCode: z.string()
  }),
  z.object({
    __type: z.literal("IndictmentOffenceCode"),
    Indictment: z.string(),
    Reason: z.string(),
    Qualifier: z.string().optional(),
    FullCode: z.string()
  })
])

export const offenceReasonSchema = z.discriminatedUnion("__type", [
  z.object({
    __type: z.literal("LocalOffenceReason"),
    LocalOffenceCode: localOffenceCodeSchema
  }),
  z.object({
    __type: z.literal("NationalOffenceReason"),
    OffenceCode: offenceCodeSchema
  })
])

export const organisationUnitSchema = z.object({
  TopLevelCode: z.string().optional(),
  SecondLevelCode: z.string(),
  ThirdLevelCode: z.string(),
  BottomLevelCode: z.string(),
  OrganisationUnitCode: z.string().regex(/[A-JZ0-9]{0,1}[A-Z0-9]{6}/, ExceptionCode.HO100200)
})

export const defendantOrOffenderSchema = z.object({
  Year: z.string(),
  OrganisationUnitIdentifierCode: organisationUnitSchema,
  DefendantOrOffenderSequenceNumber: z.string(),
  CheckDigit: z.string()
})

export const criminalProsecutionReferenceSchema = z.object({
  DefendantOrOffender: defendantOrOffenderSchema,
  OffenceReason: offenceReasonSchema.optional(),
  OffenceReasonSequence: z.number().or(z.null()).optional()
})

export const durationSchema = z.object({
  DurationType: z.string().refine(validateDurationType, ExceptionCode.HO100108),
  DurationUnit: z.string().refine(validateDurationUnit, ExceptionCode.HO100108),
  DurationLength: z.number().min(1, ExceptionCode.HO100242).max(999, ExceptionCode.HO100242)
})

export const dateSpecifiedInResultSchema = z.object({
  Date: z.date(),
  Sequence: z.number()
})

export const numberSpecifiedInResultSchema = z.object({
  Number: z.number().min(1, ExceptionCode.HO100244).max(9999, ExceptionCode.HO100244),
  Type: z.string()
})

export const amountSpecifiedInResultSchema = z.object({
  Amount: z.number().refine(validateAmountSpecifiedInResult, ExceptionCode.HO100243),
  Type: z.string().optional()
})

export const resultQualifierVariableSchema = z.object({
  Code: z
    .string()
    .min(1, ExceptionCode.HO100247)
    .max(2, ExceptionCode.HO100247)
    .refine(validateResultQualifierCode, ExceptionCode.HO100309), // HO100309 is tested but HO100247 is masked by XML parsing
  Duration: durationSchema.optional(),
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  Text: z.string().optional()
})

export const addressLine = z.string().min(1, ExceptionCode.HO100217).max(35, ExceptionCode.HO100217)

export const addressSchema = z.object({
  AddressLine1: addressLine,
  AddressLine2: addressLine.optional(),
  AddressLine3: addressLine.optional(),
  AddressLine4: addressLine.optional(),
  AddressLine5: addressLine.optional()
})

export const personNameSchema = z.object({
  Title: z.string().min(1, ExceptionCode.HO100212).max(35, ExceptionCode.HO100212).optional(),
  GivenName: z.array(z.string().min(1, ExceptionCode.HO100213).max(35, ExceptionCode.HO100213)),
  FamilyName: z.string().min(1, ExceptionCode.HO100215).max(35, ExceptionCode.HO100215),
  Suffix: z.string().optional()
})

export const defendantDetailSchema = z.object({
  PersonName: personNameSchema,
  GeneratedPNCFilename: z.string().optional(),
  BirthDate: z.date().optional(),
  Gender: z.number()
})

export const courtReferenceSchema = z.object({
  CrownCourtReference: z.string().optional(),
  MagistratesCourtReference: z.string()
})

export const sourceReferenceSchema = z.object({
  DocumentName: z.string(),
  UniqueID: z.string(),
  DocumentType: z.string(),
  TimeStamp: z.string().optional(),
  Version: z.string().optional(),
  SecurityClassification: z.string().optional(),
  SellByDate: z.date().optional(),
  XSLstylesheetURL: z.string().optional()
})

export const hearingSchema = z.object({
  CourtHearingLocation: organisationUnitSchema,
  DateOfHearing: z.date(),
  TimeOfHearing: timeSchema,
  HearingLanguage: z.string(),
  HearingDocumentationLanguage: z.string(),
  DefendantPresentAtHearing: z.string(),
  ReportRequestedDate: z.date().optional(),
  ReportCompletedDate: z.date().optional(),
  SourceReference: sourceReferenceSchema,
  CourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Can't test this in Bichard because it is always set to a valid value
  CourtHouseCode: z.number().min(100, ExceptionCode.HO100249).max(9999, ExceptionCode.HO100249),
  CourtHouseName: z.string().optional()
})

export const urgentSchema = z.object({
  urgent: z.boolean(),
  urgency: z.number().min(0, ExceptionCode.HO100109).max(999, ExceptionCode.HO100110)
})

export const cjsPleaSchema = z.nativeEnum(CjsPlea)

export const resultSchema = z.object({
  CJSresultCode: z.number().superRefine(validateResultCode),
  OffenceRemandStatus: z.string().refine(validateRemandStatus, ExceptionCode.HO100108).optional(), // Tested in HO100108
  SourceOrganisation: organisationUnitSchema,
  CourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid court so unable to test
  ConvictingCourt: z.string().optional(),
  ResultHearingType: z.string().refine(validateTypeOfHearing, ExceptionCode.HO100108).optional(), // Always set to OTHER so can't test exception
  ResultHearingDate: z.date().optional(),
  Duration: durationSchema.array().optional(),
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  TimeSpecifiedInResult: timeSchema.optional(),
  AmountSpecifiedInResult: amountSpecifiedInResultSchema.array().optional(),
  NumberSpecifiedInResult: numberSpecifiedInResultSchema.array().optional(),
  NextResultSourceOrganisation: organisationUnitSchema.or(z.null()).optional(),
  NextHearingType: z.string().refine(validateTypeOfHearing, ExceptionCode.HO100108).optional(), // Never set
  NextHearingDate: z.date().optional(),
  NextHearingTime: timeSchema.optional(),
  NextCourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid value
  PleaStatus: cjsPleaSchema.optional(),
  Verdict: z.string().refine(validateVerdict, ExceptionCode.HO100108).optional(), // Tested in HO100108
  ResultVariableText: z.string().min(1, ExceptionCode.HO100245).max(2500, ExceptionCode.HO100245).optional(), // Can't test because it is masked by XML parser
  TargetCourtType: z.string().refine(validateTargetCourtType, ExceptionCode.HO100108).optional(), // Never set
  WarrantIssueDate: z.date().optional(),
  CRESTDisposalCode: z.string().optional(),
  ModeOfTrialReason: z.string().refine(validateModeOfTrialReason, ExceptionCode.HO100108).optional(), // Tested in HO100108
  PNCDisposalType: z.number().min(1000, ExceptionCode.HO100246).max(9999, ExceptionCode.HO100246).optional(),
  PNCAdjudicationExists: z.boolean().optional(),
  ResultClass: z.nativeEnum(ResultClass).optional(), // Always set to a valid value
  NumberOfOffencesTIC: z.number().optional(),
  ReasonForOffenceBailConditions: z
    .string()
    .min(1, ExceptionCode.HO100106)
    .max(2500, ExceptionCode.HO100107)
    .optional(), // Can't test because it is masked by XML parser
  ResultQualifierVariable: resultQualifierVariableSchema.array().min(0),
  ResultHalfLifeHours: z.number().min(1, ExceptionCode.HO100109).max(999, ExceptionCode.HO100110).optional(), // Can't test because all values come from standing data
  Urgent: urgentSchema.optional(),
  ResultApplicableQualifierCode: z
    .string()
    .min(1, ExceptionCode.HO100241)
    .min(2, ExceptionCode.HO100241)
    .array()
    .min(0)
    .optional(), // Can't test as this is always set to an empty arrays
  BailCondition: z.string().min(1, ExceptionCode.HO100219).max(2500, ExceptionCode.HO100219).array().min(0).optional()
})

export const offenceSchema = z.object({
  CriminalProsecutionReference: criminalProsecutionReferenceSchema,
  OffenceCategory: z.string().refine(validateOffenceCategory).optional(),
  OffenceInitiationCode: z.string().refine(validateOffenceInitiationCode).optional(),
  OffenceTitle: z.string().min(1, ExceptionCode.HO100233).max(120, ExceptionCode.HO100233).optional(),
  SummonsCode: z.string().refine(validateSummonsCode).optional(),
  Informant: z.string().optional(),
  ArrestDate: z.date().optional(),
  ChargeDate: z.date().optional(),
  ActualOffenceDateCode: z.string().refine(validateActualOffenceDateCode),
  ActualOffenceStartDate: actualOffenceStartDateSchema,
  ActualOffenceEndDate: actualOffenceEndDateSchema.optional(),
  LocationOfOffence: z.string().min(1, ExceptionCode.HO100232).max(80, ExceptionCode.HO100232),
  OffenceWelshTitle: z.string().optional(),
  ActualOffenceWording: z.string().min(1, ExceptionCode.HO100234).max(2500, ExceptionCode.HO100234),
  ActualWelshOffenceWording: z.string().optional(),
  ActualIndictmentWording: z.string().optional(),
  ActualWelshIndictmentWording: z.string().optional(),
  ActualStatementOfFacts: z.string().optional(),
  ActualWelshStatementOfFacts: z.string().optional(),
  AlcoholLevel: alcoholLevelSchema.optional(),
  VehicleCode: z.string().refine(validateVehicleCode).optional(),
  VehicleRegistrationMark: z.string().min(11).max(11).optional(),
  StartTime: timeSchema.optional(),
  OffenceEndTime: timeSchema.optional(),
  OffenceTime: timeSchema.optional(),
  ConvictionDate: z.date().optional(),
  CommittedOnBail: z.string().refine(validateYesNo),
  CourtCaseReferenceNumber: z.string().or(z.null()).optional(),
  ManualCourtCaseReferenceNumber: z.string().optional(),
  CourtOffenceSequenceNumber: z.number().min(0, ExceptionCode.HO100239).max(999, ExceptionCode.HO100239),
  ManualSequenceNumber: z.boolean().optional(),
  Result: resultSchema.array().min(0),
  RecordableOnPNCindicator: z.boolean().optional(),
  NotifiableToHOindicator: z.boolean().optional(),
  HomeOfficeClassification: z
    .string()
    .regex(/^([0-9]{3})\/([0-9]{2})$/, ExceptionCode.HO100236)
    .optional(),
  ResultHalfLifeHours: z.number().min(1).max(999).optional(),
  AddedByTheCourt: z.boolean().optional()
})

export const asnSchema = z.string()
export const croNumberSchema = z.string().regex(/[0-9]{1,6}\/[0-9]{2}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100207)
export const driverNumberSchema = z.string().regex(/[A-Z0-9]{5}[0-9]{6}[A-Z0-9]{3}[A-Z]{2}/, ExceptionCode.HO100208)
export const pncIdentifierSchema = z.string().regex(/[0-9]{4}\/[0-9]{7}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100209)

export const hearingDefendantSchema = z.object({
  ArrestSummonsNumber: asnSchema,
  DriverNumber: driverNumberSchema.optional(),
  CRONumber: croNumberSchema.optional(),
  PNCIdentifier: pncIdentifierSchema.optional(),
  PNCCheckname: z.string().max(54, ExceptionCode.HO100210).optional(),
  DefendantDetail: defendantDetailSchema,
  Address: addressSchema,
  RemandStatus: z.string().refine(validateRemandStatus, ExceptionCode.HO100108),
  BailConditions: z.string().array().min(0),
  ReasonForBailConditions: z.string().min(1, ExceptionCode.HO100220).max(2500, ExceptionCode.HO100220).optional(),
  CourtPNCIdentifier: pncIdentifierSchema.optional(),
  OrganisationName: z.string().min(1, ExceptionCode.HO100211).max(255, ExceptionCode.HO100211).optional(),
  Offence: offenceSchema.array().min(0),
  Result: resultSchema.optional()
})

export const caseSchema = z.object({
  PTIURN: z.string().regex(/[A-Z0-9]{4}[0-9]{3,7}/, ExceptionCode.HO100201),
  CaseMarker: z.string().min(0, ExceptionCode.HO100202).max(255, ExceptionCode.HO100202).optional(), // Note: This doesn't seem to ever be set in the original code
  CPSOrganisation: organisationUnitSchema.optional(),
  PreChargeDecisionIndicator: z.boolean(),
  CourtCaseReferenceNumber: z
    .string()
    .regex(/[0-9]{2}\/[0-9]{4}\/[0-9]{6}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100203)
    .optional(),
  PenaltyNoticeCaseReferenceNumber: z.string().optional(),
  CourtReference: courtReferenceSchema,
  CourtOfAppealResult: z.string().optional(),
  ForceOwner: organisationUnitSchema.optional(),
  RecordableOnPNCindicator: z.boolean().optional(),
  HearingDefendant: hearingDefendantSchema,
  Urgent: urgentSchema.optional()
})

export const hearingOutcomeSchema = z.object({
  Hearing: hearingSchema,
  Case: caseSchema
})

export const annotatedHearingOutcomeSchema = z.object({
  Exceptions: z.array(exceptionSchema).optional(),
  AnnotatedHearingOutcome: z.object({
    HearingOutcome: hearingOutcomeSchema
  }),
  PncQuery: pncQueryResultSchema.optional(),
  PncQueryDate: z.date().optional()
})
