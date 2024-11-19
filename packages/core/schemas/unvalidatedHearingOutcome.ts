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
    FullCode: z.string().describe(offenceCodeDescription.FullCode.$description),
    Qualifier: z.string().optional().describe(offenceCodeDescription.Qualifier.$description),
    Reason: z.string().describe(offenceCodeDescription.Reason.$description),
    Year: z.string().optional().describe(offenceCodeDescription.Year.$description)
  }),
  z.object({
    __type: z.literal("CommonLawOffenceCode"),
    CommonLawOffence: z.string().describe(offenceCodeDescription.CommonLawOffence.$description),
    FullCode: z.string().describe(offenceCodeDescription.FullCode.$description),
    Qualifier: z.string().optional().describe(offenceCodeDescription.Qualifier.$description),
    Reason: z.string().describe(offenceCodeDescription.Reason.$description)
  }),
  z.object({
    __type: z.literal("IndictmentOffenceCode"),
    FullCode: z.string().describe(offenceCodeDescription.FullCode.$description),
    Indictment: z.string().describe(offenceCodeDescription.Indictment.$description),
    Qualifier: z.string().optional().describe(offenceCodeDescription.Qualifier.$description),
    Reason: z.string().describe(offenceCodeDescription.Reason.$description)
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
  BottomLevelCode: z.string().or(z.null()).describe(organisationUnitDescription.BottomLevelCode.$description),
  OrganisationUnitCode: z.string().or(z.null()).describe(organisationUnitDescription.OrganisationUnitCode.$description),
  SecondLevelCode: z.string().or(z.null()).describe(organisationUnitDescription.SecondLevelCode.$description),
  ThirdLevelCode: z.string().or(z.null()).describe(organisationUnitDescription.ThirdLevelCode.$description),
  TopLevelCode: z.string().optional().describe(organisationUnitDescription.TopLevelCode.$description)
})

export const defendantOrOffenderSchema = z.object({
  CheckDigit: z
    .string()
    .describe(offenceDescription.CriminalProsecutionReference.DefendantOrOffender.CheckDigit.$description),
  DefendantOrOffenderSequenceNumber: z
    .string()
    .describe(
      offenceDescription.CriminalProsecutionReference.DefendantOrOffender.DefendantOrOffenderSequenceNumber.$description
    ),
  OrganisationUnitIdentifierCode: organisationUnitSchema.describe(
    offenceDescription.CriminalProsecutionReference.DefendantOrOffender.OrganisationUnitIdentifierCode.$description
  ),
  Year: z
    .string()
    .or(z.null())
    .describe(offenceDescription.CriminalProsecutionReference.DefendantOrOffender.Year.$description)
})

export const criminalProsecutionReferenceSchema = z.object({
  DefendantOrOffender: defendantOrOffenderSchema.optional(),
  OffenceReason: offenceReasonSchema.optional(),
  OffenceReasonSequence: z.string().or(z.null()).optional()
})

export const durationSchema = z.object({
  DurationLength: z.number(),
  DurationType: z.string(),
  DurationUnit: z.string()
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
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  Duration: durationSchema.optional(),
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
  FamilyName: z.string().describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.FamilyName.$description),
  GivenName: z
    .array(z.string())
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.GivenName.$description),
  Suffix: z.string().optional(),
  Title: z.string().optional().describe(caseDescription.HearingDefendant.DefendantDetail.PersonName.Title.$description)
})

export const defendantDetailSchema = z.object({
  BirthDate: z.coerce
    .date()
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.BirthDate.$description),
  Gender: z.number().describe(caseDescription.HearingDefendant.DefendantDetail.Gender.$description),
  GeneratedPNCFilename: z
    .string()
    .optional()
    .describe(caseDescription.HearingDefendant.DefendantDetail.GeneratedPNCFilename.$description),
  PersonName: personNameSchema
})

export const courtReferenceSchema = z.object({
  CrownCourtReference: z.string().optional().describe("Not used"),
  MagistratesCourtReference: z.string().describe(caseDescription.CourtReference.MagistratesCourtReference.$description)
})

export const courtCaseReferenceNumberSchema = z.string()

export const sourceReferenceSchema = z.object({
  DocumentName: z.string(),
  DocumentType: z.string(),
  SecurityClassification: z.string().optional(),
  SellByDate: z.coerce.date().optional(),
  TimeStamp: z.string().optional(),
  UniqueID: z.string(),
  Version: z.string().optional(),
  XSLstylesheetURL: z.string().optional()
})

export const hearingSchema = z.object({
  CourtHearingLocation: organisationUnitSchema.describe(hearingDescription.CourtHearingLocation.$description),
  CourtHouseCode: z.number().describe(hearingDescription.CourtHouseCode.$description),
  CourtHouseName: z.string().optional().describe(hearingDescription.CourtHouseName.$description),
  CourtType: z.string().or(z.null()).optional().describe(hearingDescription.CourtType.$description), // Can't test this in Bichard because it is always set to a valid value
  DateOfHearing: z.coerce.date().describe(hearingDescription.DateOfHearing.$description),
  DefendantPresentAtHearing: z.string().describe(hearingDescription.DefendantPresentAtHearing.$description),
  HearingDocumentationLanguage: z.string().describe(hearingDescription.HearingDocumentationLanguage.$description),
  HearingLanguage: z.string().describe(hearingDescription.HearingLanguage.$description),
  ReportCompletedDate: z.coerce.date().optional(),
  ReportRequestedDate: z.coerce.date().optional(),
  SourceReference: sourceReferenceSchema.describe(hearingDescription.SourceReference.$description),
  TimeOfHearing: timeSchema.describe(hearingDescription.TimeOfHearing.$description)
})

export const urgentSchema = z.object({
  urgency: z.number(),
  urgent: z.boolean()
})

export const cjsPleaSchema = z.nativeEnum(CjsPlea)

export const resultSchema = z.object({
  AmountSpecifiedInResult: z
    .preprocess(
      toArray,
      amountSpecifiedInResultSchema.array().min(0).describe(resultDescription.AmountSpecifiedInResult.$description)
    )
    .optional(),
  BailCondition: z.string().array().min(0).optional().describe(resultDescription.BailCondition.$description),
  CJSresultCode: z.number().describe(resultDescription.CJSresultCode.$description),
  ConvictingCourt: z.string().optional().describe(resultDescription.ConvictingCourt.$description),
  CourtType: z.string().optional().describe(resultDescription.CourtType.$description), // Always set to a valid court so unable to test
  CRESTDisposalCode: z.string().optional(),
  DateSpecifiedInResult: dateSpecifiedInResultSchema.array().optional(),
  Duration: durationSchema.array().optional().describe(resultDescription.Duration.$description),
  ModeOfTrialReason: z.string().optional().describe(resultDescription.ModeOfTrialReason.$description),
  NextCourtType: z.string().optional().describe(resultDescription.NextCourtType.$description), // Always set to a valid value
  NextHearingDate: z.coerce
    .date()
    .or(z.string())
    .or(z.null())
    .optional()
    .describe(resultDescription.NextHearingDate.$description),
  NextHearingTime: timeSchema.optional().describe(resultDescription.NextHearingTime.$description),
  NextHearingType: z.string().optional(), // Never set
  NextResultSourceOrganisation: organisationUnitSchema
    .or(z.null())
    .optional()
    .describe(resultDescription.NextResultSourceOrganisation.$description),
  NumberOfOffencesTIC: z.number().optional().describe(resultDescription.NumberOfOffencesTIC.$description),
  NumberSpecifiedInResult: z.array(numberSpecifiedInResultSchema).optional(),
  OffenceRemandStatus: z.string().optional().describe(resultDescription.OffenceRemandStatus.$description),
  PleaStatus: cjsPleaSchema.or(z.string()).optional().describe(resultDescription.PleaStatus.$description),
  PNCAdjudicationExists: z.boolean().optional(),
  PNCDisposalType: z.number().optional(),
  ReasonForOffenceBailConditions: z
    .string()
    .optional()
    .describe(resultDescription.ReasonForOffenceBailConditions.$description), // Can't test because it is masked by XML parser
  ResultApplicableQualifierCode: z.string().array().min(0).optional(), // Can't test as this is always set to an empty arrays
  ResultClass: z.nativeEnum(ResultClass).optional().describe(resultDescription.ResultClass.$description), // Always set to a valid value
  ResultHalfLifeHours: z.number().optional().describe(offenceDescription.ResultHalfLifeHours.$description), // Can't test because all values come from standing data
  ResultHearingDate: z.coerce.date().optional().describe(resultDescription.ResultHearingDate.$description),
  ResultHearingType: z.string().optional().describe(resultDescription.ResultHearingType.$description), // Always set to OTHER so can't test exception
  ResultQualifierVariable: resultQualifierVariableSchema.array().min(0),
  ResultVariableText: z.string().optional().describe(resultDescription.ResultVariableText.$description), // Can't test because it is masked by XML parser
  SourceOrganisation: organisationUnitSchema.describe(resultDescription.SourceOrganisation.$description),
  TargetCourtType: z.string().optional(), // Never set
  TimeSpecifiedInResult: timeSchema.optional(),
  Urgent: urgentSchema.optional().describe(resultDescription.Urgent.$description),
  Verdict: z.string().optional().describe(resultDescription.Verdict.$description),
  WarrantIssueDate: z.coerce.date().optional().describe(resultDescription.WarrantIssueDate.$description)
})

export const offenceSchema = z.object({
  ActualIndictmentWording: z.string().optional(),
  ActualOffenceDateCode: z.string().describe(offenceDescription.ActualOffenceDateCode.$description),
  ActualOffenceEndDate: actualOffenceEndDateSchema
    .optional()
    .describe(offenceDescription.ActualOffenceEndDate.$description),
  ActualOffenceStartDate: actualOffenceStartDateSchema,
  ActualOffenceWording: z.string().describe(offenceDescription.ActualOffenceWording.$description),
  ActualStatementOfFacts: z.string().optional(),
  ActualWelshIndictmentWording: z.string().optional(),
  ActualWelshOffenceWording: z.string().optional(),
  ActualWelshStatementOfFacts: z.string().optional(),
  AddedByTheCourt: z.boolean().optional(),
  AlcoholLevel: alcoholLevelSchema.optional().describe(offenceDescription.AlcoholLevel.$description),
  ArrestDate: z.coerce.date().optional().describe(offenceDescription.ArrestDate.$description),
  ChargeDate: z.coerce.date().optional().describe(offenceDescription.ChargeDate.$description),
  CommittedOnBail: z.string().describe(offenceDescription.CommittedOnBail.$description),
  ConvictionDate: z.coerce.date().optional().describe(offenceDescription.ConvictionDate.$description),
  CourtCaseReferenceNumber: courtCaseReferenceNumberSchema.or(z.null()).optional(),
  CourtOffenceSequenceNumber: z.number().describe(offenceDescription.CourtOffenceSequenceNumber.$description),
  CriminalProsecutionReference: criminalProsecutionReferenceSchema,
  HomeOfficeClassification: z.string().optional().describe(offenceDescription.HomeOfficeClassification.$description),
  Informant: z.string().optional(),
  LocationOfOffence: z.string().optional().describe(offenceDescription.LocationOfOffence.$description),
  ManualCourtCaseReference: z.boolean().optional(),
  ManualSequenceNumber: z.boolean().optional(),
  NotifiableToHOindicator: z.boolean().optional().describe(offenceDescription.NotifiableToHOindicator.$description),
  OffenceCategory: z.string().optional().describe(offenceDescription.OffenceCategory.$description),
  OffenceEndTime: timeSchema.optional().describe(offenceDescription.OffenceEndDate.$description),
  OffenceInitiationCode: z.string().optional(),
  OffenceTime: timeSchema.optional().describe(offenceDescription.OffenceTime.$description),
  OffenceTitle: z.string().optional().describe(offenceDescription.OffenceTitle.$description),
  OffenceWelshTitle: z.string().optional(),
  RecordableOnPNCindicator: z.boolean().optional().describe(offenceDescription.RecordableOnPNCindicator.$description),
  Result: resultSchema.array().min(0),
  ResultHalfLifeHours: z.number().optional(),
  StartTime: timeSchema.optional().describe(offenceDescription.StartTime.$description),
  SummonsCode: z.string().optional(),
  VehicleCode: z.string().optional(),
  VehicleRegistrationMark: z.string().optional()
})

export const asnSchema = z.string()
export const croNumberSchema = z.string()
export const driverNumberSchema = z.string()
export const pncIdentifierSchema = z.string()

export const hearingDefendantSchema = z.object({
  Address: addressSchema.describe(caseDescription.HearingDefendant.Address.$description),
  ArrestSummonsNumber: asnSchema.describe(caseDescription.HearingDefendant.ArrestSummonsNumber.$description),
  BailConditions: z.string().array().min(0).describe(caseDescription.HearingDefendant.BailConditions.$description),
  CourtPNCIdentifier: pncIdentifierSchema
    .optional()
    .describe(caseDescription.HearingDefendant.CourtPNCIdentifier.$description),
  CRONumber: croNumberSchema.optional(),
  DefendantDetail: defendantDetailSchema.optional(),
  DriverNumber: driverNumberSchema.optional(),
  Offence: offenceSchema.array().min(0).describe(offenceDescription.$description),
  OrganisationName: z.string().optional().describe(caseDescription.HearingDefendant.OrganisationName.$description),
  PNCCheckname: z.string().optional(),
  PNCIdentifier: pncIdentifierSchema.optional(),
  ReasonForBailConditions: z
    .string()
    .optional()
    .describe(caseDescription.HearingDefendant.ReasonForBailConditions.$description),
  RemandStatus: z.string().describe(caseDescription.HearingDefendant.RemandStatus.$description),
  Result: resultSchema.optional()
})

export const caseSchema = z.object({
  CaseMarker: z.string().optional(),
  CourtCaseReferenceNumber: courtCaseReferenceNumberSchema.optional(),
  CourtOfAppealResult: z.string().optional(),
  CourtReference: courtReferenceSchema.describe(caseDescription.CourtReference.$description),
  CPSOrganisation: organisationUnitSchema.optional(),
  ForceOwner: organisationUnitSchema.optional().describe(caseDescription.ForceOwner.$description),
  HearingDefendant: hearingDefendantSchema,
  ManualForceOwner: z.boolean().optional(),
  PenaltyNoticeCaseReferenceNumber: z.string().optional(),
  PreChargeDecisionIndicator: z.boolean().describe(caseDescription.PreChargeDecisionIndicator.$description),
  PTIURN: z.string().describe(caseDescription.PTIURN.$description),
  RecordableOnPNCindicator: z.boolean().optional().describe(caseDescription.RecordableOnPNCindicator.$description),
  Urgent: urgentSchema.optional().describe(caseDescription.Urgent.$description)
})

export const hearingOutcomeSchema = z.object({
  Case: caseSchema.describe(caseDescription.$description),
  Hearing: hearingSchema.describe(hearingDescription.$description)
})

export const unvalidatedHearingOutcomeSchema = z.object({
  AnnotatedHearingOutcome: z.object({
    HearingOutcome: hearingOutcomeSchema
  }),
  Exceptions: z.array(exceptionSchema),
  HasError: z.boolean().optional(),
  Ignored: z.boolean().optional(),
  PncErrorMessage: z.string().optional().describe(ahoDescription.AnnotatedHearingOutcome.PncErrorMessage.$description),
  PncQuery: pncQueryResultSchema.optional().describe(ahoDescription.AnnotatedHearingOutcome.PncQuery.$description),
  PncQueryDate: z.coerce.date().optional().describe(ahoDescription.AnnotatedHearingOutcome.PncQueryDate.$description)
})
