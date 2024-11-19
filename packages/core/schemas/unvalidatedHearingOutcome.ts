import { z } from "zod"
import { CjsPlea } from "../types/Plea"
import ResultClass from "../types/ResultClass"
import { exceptionSchema } from "./exception"
import { pncQueryResultSchema } from "./pncQueryResult"
import { ahoDescription, offenceDescription, organisationUnitDescription, resultDescription } from "./schemaDescription"
import toArray from "./toArray"

const hearingDescription = ahoDescription.AnnotatedHearingOutcome.HearingOutcome.Hearing
const caseDescription = ahoDescription.AnnotatedHearingOutcome.HearingOutcome.Case
const offenceCodeDescription = offenceDescription.CriminalProsecutionReference.OffenceReason.OffenceCode

export const timeSchema = z.string()

export const alcoholLevelSchema = z.object({
  Amount: z.number().describe(offenceDescription.AlcoholLevel.Amount.$description),
  Method: z.string().describe(offenceDescription.AlcoholLevel.Method.$description)
})

export const actualOffenceEndDateSchema = z.object({
  EndDate: z.coerce.date().describe(offenceDescription.ActualOffenceEndDate.EndDate.$description)
})

export const actualOffenceStartDateSchema = z.object({
  StartDate: z.coerce.date().describe(offenceDescription.ActualOffenceStartDate.StartDate.$description)
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
  OrganisationUnitCode: z.string().or(z.null()).describe(organisationUnitDescription.OrganisationUnitCode.$description)
})

export const defendantOrOffenderSchema = z.object({
  Year: z
    .string()
    .or(z.null())
    .describe(offenceDescription.CriminalProsecutionReference.DefendantOrOffender.Year.$description),
  OrganisationUnitIdentifierCode: organisationUnitSchema.describe(
    offenceDescription.CriminalProsecutionReference.DefendantOrOffender.OrganisationUnitIdentifierCode.$description
  ),
  DefendantOrOffenderSequenceNumber: z
    .string()
    .describe(
      offenceDescription.CriminalProsecutionReference.DefendantOrOffender.DefendantOrOffenderSequenceNumber.$description
    ),
  CheckDigit: z
    .string()
    .describe(offenceDescription.CriminalProsecutionReference.DefendantOrOffender.CheckDigit.$description)
})

export const criminalProsecutionReferenceSchema = z.object({
  DefendantOrOffender: defendantOrOffenderSchema.optional(),
  OffenceReason: offenceReasonSchema.optional(),
  OffenceReasonSequence: z.string().or(z.null()).optional()
})

export const durationSchema = z.object({
  DurationType: z.string(),
  DurationUnit: z.string(),
  DurationLength: z.number()
})

export const dateSpecifiedInResultSchema = z.object({
  Date: z.coerce.date().describe(resultDescription.DateSpecifiedInResult.Date.$description),
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
  Code: z.string().describe(resultDescription.ResultQualifierVariable.Code.$description),
  Duration: durationSchema.optional(),
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  Text: z.string().optional()
})

export const addressLine = z.string()

export const addressSchema = z.object({
  AddressLine1: addressLine.describe(caseDescription.HearingDefendant.Address.AddressLine1.$description),
  AddressLine2: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine2.$description),
  AddressLine3: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine3.$description),
  AddressLine4: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine4.$description),
  AddressLine5: addressLine.optional().describe(caseDescription.HearingDefendant.Address.AddressLine5.$description)
})

export const personNameSchema = z.object({
  Title: z.string().optional().describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.Title.$description),
  GivenName: z
    .array(z.string())
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.GivenName.$description),
  FamilyName: z.string().describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.FamilyName.$description),
  Suffix: z.string().optional()
})

export const defendantDetailSchema = z.object({
  PersonName: personNameSchema,
  GeneratedPNCFilename: z
    .string()
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.GeneratedPNCFilename.$description),
  BirthDate: z.coerce
    .date()
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.BirthDate.$description),
  Gender: z.number().describe(caseDescription.HearingDefendant.DefendantDetail.Gender.$description)
})

export const courtReferenceSchema = z.object({
  CrownCourtReference: z.string().optional().describe("Not used"),
  MagistratesCourtReference: z.string().describe(caseDescription.CourtReference.MagistratesCourtReference.$description)
})

export const courtCaseReferenceNumberSchema = z.string()

export const sourceReferenceSchema = z.object({
  DocumentName: z.string(),
  UniqueID: z.string(),
  DocumentType: z.string(),
  TimeStamp: z.string().optional(),
  Version: z.string().optional(),
  SecurityClassification: z.string().optional(),
  SellByDate: z.coerce.date().optional(),
  XSLstylesheetURL: z.string().optional()
})

export const hearingSchema = z.object({
  CourtHearingLocation: organisationUnitSchema.describe(hearingDescription.CourtHearingLocation.$description),
  DateOfHearing: z.coerce.date().describe(hearingDescription.DateOfHearing.$description),
  TimeOfHearing: timeSchema.describe(hearingDescription.TimeOfHearing.$description),
  HearingLanguage: z.string().describe(hearingDescription.HearingLanguage.$description),
  HearingDocumentationLanguage: z.string().describe(hearingDescription.HearingDocumentationLanguage.$description),
  DefendantPresentAtHearing: z.string().describe(hearingDescription.DefendantPresentAtHearing.$description),
  ReportRequestedDate: z.coerce.date().optional(),
  ReportCompletedDate: z.coerce.date().optional(),
  SourceReference: sourceReferenceSchema.describe(hearingDescription.SourceReference.$description),
  CourtType: z.string().or(z.null()).optional().describe(hearingDescription.CourtType.$description), // Can't test this in Bichard because it is always set to a valid value
  CourtHouseCode: z.number().describe(hearingDescription.CourtHouseCode.$description),
  CourtHouseName: z.string().optional().describe(hearingDescription.CourtHouseName.$description)
})

export const urgentSchema = z.object({
  urgent: z.boolean(),
  urgency: z.number()
})

export const cjsPleaSchema = z.nativeEnum(CjsPlea)

export const resultSchema = z.object({
  CJSresultCode: z.number().describe(resultDescription.CJSresultCode.$description),
  OffenceRemandStatus: z.string().optional().describe(resultDescription.OffenceRemandStatus.$description),
  SourceOrganisation: organisationUnitSchema.describe(resultDescription.SourceOrganisation.$description),
  CourtType: z.string().optional().describe(resultDescription.CourtType.$description), // Always set to a valid court so unable to test
  ConvictingCourt: z.string().optional().describe(resultDescription.ConvictingCourt.$description),
  ResultHearingType: z.string().optional().describe(resultDescription.ResultHearingType.$description), // Always set to OTHER so can't test exception
  ResultHearingDate: z.coerce.date().optional().describe(resultDescription.ResultHearingDate.$description),
  Duration: durationSchema.array().optional().describe(resultDescription.Duration.$description),
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  TimeSpecifiedInResult: timeSchema.optional(),
  AmountSpecifiedInResult: z
    .preprocess(
      toArray,
      amountSpecifiedInResultSchema.array().min(0).describe(resultDescription.AmountSpecifiedInResult.$description)
    )
    .optional(),
  NumberSpecifiedInResult: z.array(numberSpecifiedInResultSchema).optional(),
  NextResultSourceOrganisation: organisationUnitSchema
    .or(z.null())
    .optional()
    .describe(resultDescription.NextResultSourceOrganisation.$description),
  NextHearingType: z.string().optional(), // Never set
  NextHearingDate: z.coerce
    .date()
    .or(z.string())
    .or(z.null())
    .optional()
    .describe(resultDescription.NextHearingDate.$description),
  NextHearingTime: timeSchema.optional().describe(resultDescription.NextHearingTime.$description),
  NextCourtType: z.string().optional().describe(resultDescription.NextCourtType.$description), // Always set to a valid value
  PleaStatus: cjsPleaSchema.or(z.string()).optional().describe(resultDescription.PleaStatus.$description),
  Verdict: z.string().optional().describe(resultDescription.Verdict.$description),
  ResultVariableText: z.string().optional().describe(resultDescription.ResultVariableText.$description), // Can't test because it is masked by XML parser
  TargetCourtType: z.string().optional(), // Never set
  WarrantIssueDate: z.coerce.date().optional().describe(resultDescription.WarrantIssueDate.$description),
  CRESTDisposalCode: z.string().optional(),
  ModeOfTrialReason: z.string().optional().describe(resultDescription.ModeOfTrialReason.$description),
  PNCDisposalType: z.number().optional(),
  PNCAdjudicationExists: z.boolean().optional(),
  ResultClass: z.nativeEnum(ResultClass).optional().describe(resultDescription.ResultClass.$description), // Always set to a valid value
  NumberOfOffencesTIC: z.number().optional().describe(resultDescription.NumberOfOffencesTIC.$description),
  ReasonForOffenceBailConditions: z
    .string()
    .optional()
    .describe(resultDescription.ReasonForOffenceBailConditions.$description), // Can't test because it is masked by XML parser
  ResultQualifierVariable: resultQualifierVariableSchema.array().min(0),
  ResultHalfLifeHours: z.number().optional().describe(offenceDescription.ResultHalfLifeHours.$description), // Can't test because all values come from standing data
  Urgent: urgentSchema.optional().describe(resultDescription.Urgent.$description),
  ResultApplicableQualifierCode: z.string().array().min(0).optional(), // Can't test as this is always set to an empty arrays
  BailCondition: z.string().array().min(0).optional().describe(resultDescription.BailCondition.$description)
})

export const offenceSchema = z.object({
  CriminalProsecutionReference: criminalProsecutionReferenceSchema,
  OffenceCategory: z.string().optional().describe(offenceDescription.OffenceCategory.$description),
  OffenceInitiationCode: z.string().optional(),
  OffenceTitle: z.string().optional().describe(offenceDescription.OffenceTitle.$description),
  SummonsCode: z.string().optional(),
  Informant: z.string().optional(),
  ArrestDate: z.coerce.date().optional().describe(offenceDescription.ArrestDate.$description),
  ChargeDate: z.coerce.date().optional().describe(offenceDescription.ChargeDate.$description),
  ActualOffenceDateCode: z.string().describe(offenceDescription.ActualOffenceDateCode.$description),
  ActualOffenceStartDate: actualOffenceStartDateSchema,
  ActualOffenceEndDate: actualOffenceEndDateSchema
    .optional()
    .describe(offenceDescription.ActualOffenceEndDate.$description),
  LocationOfOffence: z.string().optional().describe(offenceDescription.LocationOfOffence.$description),
  OffenceWelshTitle: z.string().optional(),
  ActualOffenceWording: z.string().describe(offenceDescription.ActualOffenceWording.$description),
  ActualWelshOffenceWording: z.string().optional(),
  ActualIndictmentWording: z.string().optional(),
  ActualWelshIndictmentWording: z.string().optional(),
  ActualStatementOfFacts: z.string().optional(),
  ActualWelshStatementOfFacts: z.string().optional(),
  AlcoholLevel: alcoholLevelSchema.optional().describe(offenceDescription.AlcoholLevel.$description),
  VehicleCode: z.string().optional(),
  VehicleRegistrationMark: z.string().optional(),
  StartTime: timeSchema.optional().describe(offenceDescription.StartTime.$description),
  OffenceEndTime: timeSchema.optional().describe(offenceDescription.OffenceEndDate.$description),
  OffenceTime: timeSchema.optional().describe(offenceDescription.OffenceTime.$description),
  ConvictionDate: z.coerce.date().optional().describe(offenceDescription.ConvictionDate.$description),
  CommittedOnBail: z.string().describe(offenceDescription.CommittedOnBail.$description),
  CourtCaseReferenceNumber: courtCaseReferenceNumberSchema.or(z.null()).optional(),
  ManualCourtCaseReference: z.boolean().optional(),
  CourtOffenceSequenceNumber: z.number().describe(offenceDescription.CourtOffenceSequenceNumber.$description),
  ManualSequenceNumber: z.boolean().optional(),
  Result: resultSchema.array().min(0),
  RecordableOnPNCindicator: z.boolean().optional().describe(offenceDescription.RecordableOnPNCindicator.$description),
  NotifiableToHOindicator: z.boolean().optional().describe(offenceDescription.NotifiableToHOindicator.$description),
  HomeOfficeClassification: z.string().optional().describe(offenceDescription.HomeOfficeClassification.$description),
  ResultHalfLifeHours: z.number().optional(),
  AddedByTheCourt: z.boolean().optional()
})

export const asnSchema = z.string()
export const croNumberSchema = z.string()
export const driverNumberSchema = z.string()
export const pncIdentifierSchema = z.string()

export const hearingDefendantSchema = z.object({
  ArrestSummonsNumber: asnSchema.describe(caseDescription.HearingDefendant.ArrestSummonsNumber.$description),
  DriverNumber: driverNumberSchema.optional(),
  CRONumber: croNumberSchema.optional(),
  PNCIdentifier: pncIdentifierSchema.optional(),
  PNCCheckname: z.string().optional(),
  DefendantDetail: defendantDetailSchema.optional(),
  Address: addressSchema.describe(caseDescription.HearingDefendant.Address.$description),
  RemandStatus: z.string().describe(caseDescription.HearingDefendant.RemandStatus.$description),
  BailConditions: z.string().array().min(0).describe(caseDescription.HearingDefendant.BailConditions.$description),
  ReasonForBailConditions: z
    .string()
    .optional()
    .describe(caseDescription.HearingDefendant.ReasonForBailConditions.$description),
  CourtPNCIdentifier: pncIdentifierSchema
    .optional()
    .describe(caseDescription.HearingDefendant.CourtPNCIdentifier.$description),
  OrganisationName: z.string().optional().describe(caseDescription.HearingDefendant.OrganisationName.$description),
  Offence: offenceSchema.array().min(0).describe(offenceDescription.$description),
  Result: resultSchema.optional()
})

export const caseSchema = z.object({
  PTIURN: z.string().describe(caseDescription.PTIURN.$description),
  CaseMarker: z.string().optional(),
  CPSOrganisation: organisationUnitSchema.optional(),
  PreChargeDecisionIndicator: z.boolean().describe(caseDescription.PreChargeDecisionIndicator.$description),
  CourtCaseReferenceNumber: courtCaseReferenceNumberSchema.optional(),
  PenaltyNoticeCaseReferenceNumber: z.string().optional(),
  CourtReference: courtReferenceSchema.describe(caseDescription.CourtReference.$description),
  CourtOfAppealResult: z.string().optional(),
  ForceOwner: organisationUnitSchema.optional().describe(caseDescription.ForceOwner.$description),
  RecordableOnPNCindicator: z.boolean().optional().describe(caseDescription.RecordableOnPNCindicator.$description),
  HearingDefendant: hearingDefendantSchema,
  Urgent: urgentSchema.optional().describe(caseDescription.Urgent.$description),
  ManualForceOwner: z.boolean().optional()
})

export const hearingOutcomeSchema = z.object({
  Hearing: hearingSchema.describe(hearingDescription.$description),
  Case: caseSchema.describe(caseDescription.$description)
})

export const unvalidatedHearingOutcomeSchema = z.object({
  Exceptions: z.array(exceptionSchema),
  AnnotatedHearingOutcome: z.object({
    HearingOutcome: hearingOutcomeSchema
  }),
  PncQuery: pncQueryResultSchema.optional().describe(ahoDescription.AnnotatedHearingOutcome.PncQuery.$description),
  PncQueryDate: z.coerce.date().optional().describe(ahoDescription.AnnotatedHearingOutcome.PncQueryDate.$description),
  PncErrorMessage: z.string().optional().describe(ahoDescription.AnnotatedHearingOutcome.PncErrorMessage.$description),
  Ignored: z.boolean().optional(),
  HasError: z.boolean().optional()
})
