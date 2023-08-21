import { z } from "zod"
import { ExceptionCode } from "../types/ExceptionCode"
import { CjsPlea } from "../types/Plea"
import ResultClass from "../types/ResultClass"
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
import { exceptionSchema } from "./exception"
import { pncQueryResultSchema } from "./pncQueryResult"
import toArray from "./toArray"
import {
  ahoDescription,
  offenceDescription,
  organisationUnitDescription,
  resultDescription
} from "./schema-description"

const hearingDescription = ahoDescription.AnnotatedHearingOutcome.HearingOutcome.Hearing
const caseDescription = ahoDescription.AnnotatedHearingOutcome.HearingOutcome.Case
const offenceCodeDescription = offenceDescription.CriminalProsecutionReference.OffenceReason.OffenceCode

export const timeSchema = z.string().regex(/(([0-1][0-9])|([2][0-3])):[0-5][0-9]/, ExceptionCode.HO100103)

export const alcoholLevelSchema = z.object({
  Amount: z
    .number()
    .min(0, ExceptionCode.HO100237)
    .max(999, ExceptionCode.HO100237)
    .describe(offenceDescription.AlcoholLevel.Amount.$description),
  Method: z.string().describe(offenceDescription.AlcoholLevel.Method.$description)
})

export const actualOffenceEndDateSchema = z.object({
  EndDate: z.date().describe(offenceDescription.ActualOffenceEndDate.EndDate.$description)
})

export const actualOffenceStartDateSchema = z.object({
  StartDate: z.date().describe(offenceDescription.ActualOffenceStartDate.StartDate.$description)
})

export const localOffenceCodeSchema = z.object({
  AreaCode: z.string(),
  OffenceCode: z.string()
})

export const offenceCodeSchema = z.discriminatedUnion("__type", [
  z.object({
    __type: z.literal("NonMatchingOffenceCode"),
    ActOrSource: z.string().describe(offenceCodeDescription.ActOrSource.$description),
    Year: z.string().optional().describe(offenceCodeDescription.Year.$description),
    Reason: z.string().describe(offenceCodeDescription.Reason.$description),
    Qualifier: z.string().optional().describe(offenceCodeDescription.Qualifier.$description),
    FullCode: z.string().describe(offenceCodeDescription.FullCode.$description)
  }),
  z.object({
    __type: z.literal("CommonLawOffenceCode"),
    CommonLawOffence: z.string().describe(offenceCodeDescription.CommonLawOffence.$description),
    Reason: z.string().describe(offenceCodeDescription.Reason.$description),
    Qualifier: z.string().optional().describe(offenceCodeDescription.Qualifier.$description),
    FullCode: z.string().describe(offenceCodeDescription.FullCode.$description)
  }),
  z.object({
    __type: z.literal("IndictmentOffenceCode"),
    Indictment: z.string().describe(offenceCodeDescription.Indictment.$description),
    Reason: z.string().describe(offenceCodeDescription.Reason.$description),
    Qualifier: z.string().optional().describe(offenceCodeDescription.Qualifier.$description),
    FullCode: z.string().describe(offenceCodeDescription.FullCode.$description)
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
  TopLevelCode: z.string().optional().describe(organisationUnitDescription.TopLevelCode.$description),
  SecondLevelCode: z.string().or(z.null()).describe(organisationUnitDescription.SecondLevelCode.$description),
  ThirdLevelCode: z.string().or(z.null()).describe(organisationUnitDescription.ThirdLevelCode.$description),
  BottomLevelCode: z.string().or(z.null()).describe(organisationUnitDescription.BottomLevelCode.$description),
  OrganisationUnitCode: z
    .string()
    .regex(/^[A-JZ0-9]{0,1}[A-Z0-9]{6}$/, ExceptionCode.HO100200)
    .describe(organisationUnitDescription.OrganisationUnitCode.$description)
})

export const defendantOrOffenderSchema = z.object({
  Year: z.string().or(z.null()),
  OrganisationUnitIdentifierCode: organisationUnitSchema,
  DefendantOrOffenderSequenceNumber: z.string(),
  CheckDigit: z.string()
})

export const criminalProsecutionReferenceSchema = z.object({
  DefendantOrOffender: defendantOrOffenderSchema,
  OffenceReason: offenceReasonSchema.optional(),
  OffenceReasonSequence: z
    .string()
    .regex(/^\d{1,3}$/, ExceptionCode.HO100228)
    .or(z.null())
    .optional()
})

export const durationSchema = z.object({
  DurationType: z.string().refine(validateDurationType, ExceptionCode.HO100108),
  DurationUnit: z.string().refine(validateDurationUnit, ExceptionCode.HO100108),
  DurationLength: z.number().min(1, ExceptionCode.HO100242).max(999, ExceptionCode.HO100242)
})

export const dateSpecifiedInResultSchema = z.object({
  Date: z.date().describe(resultDescription.DateSpecifiedInResult.Date.$description),
  Sequence: z.number().describe(resultDescription.DateSpecifiedInResult.Sequence.$description)
})

export const numberSpecifiedInResultSchema = z.object({
  Number: z.number().describe(resultDescription.NumberSpecifiedInResult.Number.$description),
  Type: z.string().describe(resultDescription.NumberSpecifiedInResult.Type.$description)
})

export const amountSpecifiedInResultSchema = z.object({
  Amount: z.number().describe(resultDescription.AmountSpecifiedInResult.Amount.$description),
  DecimalPlaces: z.number().describe(resultDescription.AmountSpecifiedInResult.DecimalPlaces.$description),
  Type: z.string().optional().describe(resultDescription.AmountSpecifiedInResult.Type.$description)
})

export const resultQualifierVariableSchema = z.object({
  Code: z
    .string()
    .superRefine(validateResultQualifierCode)
    .describe(resultDescription.ResultQualifierVariable.Code.$description),
  Duration: durationSchema.optional(),
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  Text: z.string().optional()
})

export const addressLine = z.string().min(1, ExceptionCode.HO100217).max(35, ExceptionCode.HO100217)

export const addressSchema = z.object({
  AddressLine1: addressLine.describe(caseDescription.HearingDefendant.Address.AddressLine1.$description),
  AddressLine2: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine2.$description),
  AddressLine3: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine3.$description),
  AddressLine4: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine4.$description),
  AddressLine5: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine5.$description)
})

export const personNameSchema = z.object({
  Title: z
    .string()
    .max(35, ExceptionCode.HO100212)
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.Title.$description),
  GivenName: z
    .array(z.string().max(35, ExceptionCode.HO100213))
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.GivenName.$description),
  FamilyName: z
    .string()
    .min(1, ExceptionCode.HO100215)
    .max(35, ExceptionCode.HO100215)
    .describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.FamilyName.$description),
  Suffix: z.string().optional()
})

export const defendantDetailSchema = z.object({
  PersonName: personNameSchema,
  GeneratedPNCFilename: z.string().optional(),
  BirthDate: z.date().optional().describe(caseDescription.HearingDefendant.DefendantDetail.BirthDate.$description),
  Gender: z.number().describe(caseDescription.HearingDefendant.DefendantDetail.Gender.$description)
})

export const courtReferenceSchema = z.object({
  CrownCourtReference: z.string().optional().describe("Not used"),
  MagistratesCourtReference: z.string().describe(caseDescription.CourtReference.MagistratesCourtReference.$description)
})

export const courtCaseReferenceNumberSchema = z
  .string()
  .regex(/^[0-9]{2}\/[0-9]{4}\/[0-9]{1,6}[A-HJ-NP-RT-Z]{1}$/i, ExceptionCode.HO100203)

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
  CourtHearingLocation: organisationUnitSchema.describe(hearingDescription.CourtHearingLocation.$description),
  DateOfHearing: z.date().describe(hearingDescription.DateOfHearing.$description),
  TimeOfHearing: timeSchema.describe(hearingDescription.TimeOfHearing.$description),
  HearingLanguage: z.string().describe(hearingDescription.HearingLanguage.$description),
  HearingDocumentationLanguage: z.string().describe(hearingDescription.HearingDocumentationLanguage.$description),
  DefendantPresentAtHearing: z.string().describe(hearingDescription.DefendantPresentAtHearing.$description),
  ReportRequestedDate: z.date().optional(),
  ReportCompletedDate: z.date().optional(),
  SourceReference: sourceReferenceSchema.describe(hearingDescription.SourceReference.$description),
  CourtType: z.string().or(z.null()).refine(validateCourtType, ExceptionCode.HO100108).optional(), // Can't test this in Bichard because it is always set to a valid value
  CourtHouseCode: z
    .number()
    .min(100, ExceptionCode.HO100249)
    .max(9999, ExceptionCode.HO100249)
    .describe(hearingDescription.CourtHouseCode.$description),
  CourtHouseName: z.string().optional()
})

export const urgentSchema = z.object({
  urgent: z.boolean(),
  urgency: z.number().min(0, ExceptionCode.HO100109).max(999, ExceptionCode.HO100110)
})

export const cjsPleaSchema = z.nativeEnum(CjsPlea)

export const resultSchema = z.object({
  CJSresultCode: z.number().superRefine(validateResultCode).describe(resultDescription.CJSresultCode.$description),
  OffenceRemandStatus: z
    .string()
    .refine(validateRemandStatus, ExceptionCode.HO100108)
    .optional()
    .describe(resultDescription.OffenceRemandStatus.$description), // Tested in HO100108
  SourceOrganisation: organisationUnitSchema.describe(resultDescription.SourceOrganisation.$description),
  CourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid court so unable to test
  ConvictingCourt: z.string().optional().describe(resultDescription.ConvictingCourt.$description),
  ResultHearingType: z
    .string()
    .refine(validateTypeOfHearing, ExceptionCode.HO100108)
    .optional()
    .describe(resultDescription.ResultHearingType.$description), // Always set to OTHER so can't test exception
  ResultHearingDate: z.date().optional().describe(resultDescription.ResultHearingDate.$description),
  Duration: durationSchema.array().optional().describe(resultDescription.Duration.$description),
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  TimeSpecifiedInResult: timeSchema.optional(),
  AmountSpecifiedInResult: z
    .preprocess(
      toArray,
      amountSpecifiedInResultSchema
        .refine(validateAmountSpecifiedInResult, ExceptionCode.HO100243)
        .array()
        .min(0)
        .describe(resultDescription.AmountSpecifiedInResult.$description)
    )
    .optional(),
  NumberSpecifiedInResult: z
    .array(numberSpecifiedInResultSchema.refine(validateNumberSpecifiedInResult, ExceptionCode.HO100244))
    .optional(),
  NextResultSourceOrganisation: organisationUnitSchema
    .or(z.null())
    .optional()
    .describe(resultDescription.NextResultSourceOrganisation.$description),
  NextHearingType: z.string().refine(validateTypeOfHearing, ExceptionCode.HO100108).optional(), // Never set
  NextHearingDate: z
    .date()
    .or(z.string().refine(invalid, ExceptionCode.HO100102))
    .or(z.null())
    .optional()
    .describe(resultDescription.NextHearingDate.$description),
  NextHearingTime: timeSchema.optional().describe(resultDescription.NextHearingTime.$description),
  NextCourtType: z.string().refine(validateCourtType, ExceptionCode.HO100108).optional(), // Always set to a valid value
  PleaStatus: cjsPleaSchema.optional().describe(resultDescription.PleaStatus.$description),
  Verdict: z
    .string()
    .refine(validateVerdict, ExceptionCode.HO100108)
    .optional()
    .describe(resultDescription.Verdict.$description), // Tested in HO100108
  ResultVariableText: z
    .string()
    .min(1, ExceptionCode.HO100245)
    .max(2500, ExceptionCode.HO100245)
    .optional()
    .describe(resultDescription.ResultVariableText.$description), // Can't test because it is masked by XML parser
  TargetCourtType: z.string().refine(validateTargetCourtType, ExceptionCode.HO100108).optional(), // Never set
  WarrantIssueDate: z.date().optional().describe(resultDescription.WarrantIssueDate.$description),
  CRESTDisposalCode: z.string().optional(),
  ModeOfTrialReason: z
    .string()
    .refine(validateModeOfTrialReason, ExceptionCode.HO100108)
    .optional()
    .describe(resultDescription.ModeOfTrialReason.$description), // Tested in HO100108
  PNCDisposalType: z.number().min(1000, ExceptionCode.HO100246).max(9999, ExceptionCode.HO100246).optional(),
  PNCAdjudicationExists: z.boolean().optional(),
  ResultClass: z.nativeEnum(ResultClass).optional(), // Always set to a valid value
  NumberOfOffencesTIC: z.number().optional().describe(resultDescription.NumberOfOffencesTIC.$description),
  ReasonForOffenceBailConditions: z
    .string()
    .min(1, ExceptionCode.HO100106)
    .max(2500, ExceptionCode.HO100107)
    .optional()
    .describe(resultDescription.ReasonForOffenceBailConditions.$description), // Can't test because it is masked by XML parser
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
  ArrestDate: z.date().optional().describe(offenceDescription.ArrestDate.$description),
  ChargeDate: z.date().optional().describe(offenceDescription.ChargeDate.$description),
  ActualOffenceDateCode: z
    .string()
    .refine(validateActualOffenceDateCode)
    .describe(offenceDescription.ActualOffenceDateCode.$description),
  ActualOffenceStartDate: actualOffenceStartDateSchema,
  ActualOffenceEndDate: actualOffenceEndDateSchema
    .optional()
    .describe(offenceDescription.ActualOffenceEndDate.$description),
  LocationOfOffence: z
    .string()
    .min(1, ExceptionCode.HO100232)
    .max(80, ExceptionCode.HO100232)
    .optional()
    .describe(offenceDescription.LocationOfOffence.$description),
  OffenceWelshTitle: z.string().optional(),
  ActualOffenceWording: z
    .string()
    .min(1, ExceptionCode.HO100234)
    .max(2500, ExceptionCode.HO100234)
    .describe(offenceDescription.ActualOffenceWording.$description),
  ActualWelshOffenceWording: z.string().optional(),
  ActualIndictmentWording: z.string().optional(),
  ActualWelshIndictmentWording: z.string().optional(),
  ActualStatementOfFacts: z.string().optional(),
  ActualWelshStatementOfFacts: z.string().optional(),
  AlcoholLevel: alcoholLevelSchema.optional().describe(offenceDescription.AlcoholLevel.$description),
  VehicleCode: z.string().refine(validateVehicleCode).optional(),
  VehicleRegistrationMark: z.string().min(11).max(11).optional(),
  StartTime: timeSchema.optional().describe(offenceDescription.StartTime.$description),
  OffenceEndTime: timeSchema.optional().describe(offenceDescription.OffenceEndDate.$description),
  OffenceTime: timeSchema.optional().describe(offenceDescription.OffenceTime.$description),
  ConvictionDate: z.date().optional().describe(offenceDescription.ConvictionDate.$description),
  CommittedOnBail: z.string().refine(validateYesNo).describe(offenceDescription.CommittedOnBail.$description),
  CourtCaseReferenceNumber: courtCaseReferenceNumberSchema.or(z.null()).optional(),
  ManualCourtCaseReference: z.boolean().optional(),
  CourtOffenceSequenceNumber: z
    .number()
    .min(0, ExceptionCode.HO100239)
    .max(999, ExceptionCode.HO100239)
    .describe(offenceDescription.CourtOffenceSequenceNumber.$description),
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

export const asnSchema = z.string().superRefine(validateAsn)
export const croNumberSchema = z.string().regex(/[0-9]{1,6}\/[0-9]{2}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100207)
export const driverNumberSchema = z.string().regex(/[A-Z0-9]{5}[0-9]{6}[A-Z0-9]{3}[A-Z]{2}/, ExceptionCode.HO100208)
export const pncIdentifierSchema = z.string().regex(/[0-9]{4}\/[0-9]{7}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100209)

export const hearingDefendantSchema = z.object({
  ArrestSummonsNumber: asnSchema.describe(caseDescription.HearingDefendant.ArrestSummonsNumber.$description),
  DriverNumber: driverNumberSchema.optional(),
  CRONumber: croNumberSchema.optional(),
  PNCIdentifier: pncIdentifierSchema.optional(),
  PNCCheckname: z.string().max(54, ExceptionCode.HO100210).optional(),
  DefendantDetail: defendantDetailSchema.optional(),
  Address: addressSchema.describe(caseDescription.HearingDefendant.Address.$description),
  RemandStatus: z
    .string()
    .refine(validateRemandStatus, ExceptionCode.HO100108)
    .describe(caseDescription.HearingDefendant.RemandStatus.$description),
  BailConditions: z.string().array().min(0).describe(caseDescription.HearingDefendant.BailConditions.$description),
  ReasonForBailConditions: z
    .string()
    .min(1, ExceptionCode.HO100220)
    .max(2500, ExceptionCode.HO100220)
    .optional()
    .describe(caseDescription.HearingDefendant.ReasonForBailConditions.$description),
  CourtPNCIdentifier: pncIdentifierSchema
    .optional()
    .describe(caseDescription.HearingDefendant.CourtPNCIdentifier.$description),
  OrganisationName: z
    .string()
    .min(1, ExceptionCode.HO100211)
    .max(255, ExceptionCode.HO100211)
    .optional()
    .describe(caseDescription.HearingDefendant.OrganisationName.$description),
  Offence: offenceSchema.array().min(0),
  Result: resultSchema.optional()
})

export const caseSchema = z.object({
  PTIURN: z
    .string()
    .regex(/^[A-Z0-9]{4}[0-9]{3,7}$/, ExceptionCode.HO100201)
    .describe(caseDescription.PTIURN.$description),
  CaseMarker: z.string().min(0, ExceptionCode.HO100202).max(255, ExceptionCode.HO100202).optional(), // Note: This doesn't seem to ever be set in the original code
  CPSOrganisation: organisationUnitSchema.optional(),
  PreChargeDecisionIndicator: z.boolean().describe(caseDescription.PreChargeDecisionIndicator.$description),
  CourtCaseReferenceNumber: courtCaseReferenceNumberSchema.optional(),
  PenaltyNoticeCaseReferenceNumber: z.string().optional(),
  CourtReference: courtReferenceSchema.describe(caseDescription.CourtReference.$description),
  CourtOfAppealResult: z.string().optional(),
  ForceOwner: organisationUnitSchema.optional(),
  RecordableOnPNCindicator: z.boolean().optional(),
  HearingDefendant: hearingDefendantSchema,
  Urgent: urgentSchema.optional(),
  ManualForceOwner: z.boolean().optional()
})

export const hearingOutcomeSchema = z.object({
  Hearing: hearingSchema.describe(hearingDescription.$description),
  Case: caseSchema.describe(caseDescription.$description)
})

export const annotatedHearingOutcomeSchema = z.object({
  Exceptions: z.array(exceptionSchema),
  AnnotatedHearingOutcome: z.object({
    HearingOutcome: hearingOutcomeSchema
  }),
  PncQuery: pncQueryResultSchema.optional(),
  PncQueryDate: z.date().optional(),
  PncErrorMessage: z.string().optional(),
  Ignored: z.boolean().optional()
})
