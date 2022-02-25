import { z } from "zod"
import { ExceptionCode } from "./ExceptionCode"

const alcoholLevelSchema = z.object({
  Amount: z.string(),
  Method: z.string()
})

const actualOffenceEndDateSchema = z.object({
  EndDate: z.string().optional()
})

const actualOffenceStartDateSchema = z.object({
  StartDate: z.string()
})

const localOffenceCodeSchema = z.object({
  AreaCode: z.string(),
  OffenceCode: z.string()
})

const offenceCodeSchema = z.object({
  Indictment: z.string().optional(),
  CommonLawOffence: z.string().optional(),
  ActOrSource: z.string(),
  Year: z.string(),
  Reason: z.string(),
  Qualifier: z.string()
})

const offenceReasonSchema = z.object({
  LocalOffenceCode: localOffenceCodeSchema.optional(),
  OffenceCode: offenceCodeSchema
})

const organisationUnitSchema = z.object({
  TopLevelCode: z.string().optional(),
  SecondLevelCode: z.string(),
  ThirdLevelCode: z.string(),
  BottomLevelCode: z.string(),
  OrganisationUnitCode: z.string().regex(/[A-JZ0-9]{0,1}[A-Z0-9]{6}/, ExceptionCode.HO100200)
})

const defendantOrOffenderSchema = z.object({
  Year: z.string(),
  OrganisationUnitIdentifierCode: organisationUnitSchema,
  DefendantOrOffenderSequenceNumber: z.string(),
  CheckDigit: z.string()
})

const criminalProsecutionReferenceSchema = z.object({
  DefendantOrOffender: defendantOrOffenderSchema.array().optional(),
  OffenceReason: offenceReasonSchema
})

const durationSchema = z.object({
  DurationType: z.string(),
  DurationUnit: z.string(),
  DurationLength: z.string()
})

const resultQualifierVariableSchema = z.object({
  Code: z.string(),
  Duration: durationSchema,
  DateSpecifiedInResult: z.string(),
  Text: z.string()
})

const addressSchema = z.object({
  AddressLine1: z.string(),
  AddressLine2: z.string().optional(),
  AddressLine3: z.string().optional(),
  AddressLine4: z.string().optional(),
  AddressLine5: z.string().optional(),
  UKpostcode: z.string().optional(),
  Country: z.string().optional()
})

const personNameSchema = z.object({
  Title: z.string().min(1, ExceptionCode.HO100212).max(35, ExceptionCode.HO100212).optional(),
  GivenName: z.string().array(),
  RequestedName: z.string().optional(),
  FamilyName: z.string(),
  Suffix: z.string().optional()
})

const defendantDetailSchema = z.object({
  PersonName: personNameSchema,
  GeneratedPNCFilename: z.string().optional(),
  BirthDate: z.string(),
  Gender: z.string()
})

const courtReferenceSchema = z.object({
  CrownCourtReference: z.string().optional(),
  MagistratesCourtReference: z.string()
})

const sourceReferenceSchema = z.object({
  DocumentName: z.string(),
  UniqueID: z.string(),
  DocumentType: z.string(),
  TimeStamp: z.string().optional(),
  Version: z.string().optional(),
  SecurityClassification: z.string().optional(),
  SellByDate: z.string().optional(),
  XSLstylesheetURL: z.string().optional()
})

const hearingSchema = z.object({
  CourtHearingLocation: organisationUnitSchema,
  DateOfHearing: z.string(),
  TimeOfHearing: z.string(),
  HearingLanguage: z.string(),
  HearingDocumentationLanguage: z.string(),
  DefendantPresentAtHearing: z.string(),
  ReportRequestedDate: z.string().optional(),
  ReportCompletedDate: z.string().optional(),
  SourceReference: sourceReferenceSchema,
  CourtType: z.string().optional(),
  CourtHouseCode: z.number(),
  CourtHouseName: z.string().optional()
})

const resultSchema = z.object({
  CJSresultCode: z.string(),
  OffenceRemandStatus: z.string(),
  SourceOrganisation: organisationUnitSchema,
  CourtType: z.string(),
  ResultHearingType: z.string(),
  ResultHearingDate: z.string(),
  Duration: durationSchema,
  DateSpecifiedInResult: z.string(),
  TimeSpecifiedInResult: z.string(),
  AmountSpecifiedInResult: z.string(),
  NumberSpecifiedInResult: z.string(),
  NextResultSourceOrganisation: organisationUnitSchema,
  NextHearingType: z.string(),
  NextHearingDate: z.string(),
  NextHearingTime: z.string(),
  NextCourtType: z.string(),
  PleaStatus: z.string(),
  Verdict: z.string(),
  ResultVariableText: z.string(),
  TargetCourtType: z.string(),
  WarrantIssueDate: z.string(),
  CRESTDisposalCode: z.string(),
  ModeOfTrialReason: z.string(),
  RecordableOnPNCindicator: z.string(),
  PNCDisposalType: z.string(),
  ResultClass: z.string(),
  NumberOfOffencesTIC: z.string(),
  ReasonForOffenceBailConditions: z.string(),
  ResultQualifierVariable: resultQualifierVariableSchema
})

const offenceSchema = z.object({
  CriminalProsecutionReference: criminalProsecutionReferenceSchema,
  OffenceInitiationCode: z.string().optional(),
  SummonsCode: z.string().optional(),
  Informant: z.string().optional(),
  ArrestDate: z.string().optional(),
  ChargeDate: z.string().optional(),
  ActualOffenceDateCode: z.string(),
  ActualOffenceStartDate: actualOffenceStartDateSchema,
  ActualOffenceEndDate: actualOffenceEndDateSchema,
  LocationOfOffence: z.string(),
  OffenceWelshTitle: z.string().optional(),
  ActualOffenceWording: z.string(),
  ActualWelshOffenceWording: z.string().optional(),
  ActualIndictmentWording: z.string().optional(),
  ActualWelshIndictmentWording: z.string().optional(),
  ActualStatementOfFacts: z.string().optional(),
  ActualWelshStatementOfFacts: z.string().optional(),
  AlcoholLevel: alcoholLevelSchema.optional(),
  VehicleCode: z.string().optional(),
  VehicleRegistrationMark: z.string().optional(),
  StartTime: z.string().optional(),
  OffenceEndTime: z.string().optional(),
  ConvictionDate: z.string().optional(),
  CommittedOnBail: z.string(),
  CourtOffenceSequenceNumber: z.string(),
  Result: resultSchema.optional()
})

const pncIdentifierSchema = z.string().regex(/[0-9]{4}\/[0-9]{7}[A-HJ-NP-RT-Z]{1}/, ExceptionCode.HO100209)

const hearingDefendantSchema = z.object({
  ArrestSummonsNumber: z.string(),
  DriverNumber: z.string().optional(),
  CRONumber: z.string().optional(),
  PNCIdentifier: pncIdentifierSchema.optional(),
  PNCCheckname: z.string().optional(),
  DefendantDetail: defendantDetailSchema,
  Address: addressSchema,
  RemandStatus: z.string(),
  BailConditions: z.string().array(),
  ReasonForBailConditions: z.string().optional(),
  CourtPNCIdentifier: pncIdentifierSchema.optional(),
  OrganisationName: z.string().optional(),
  Offence: offenceSchema.array().min(0),
  Result: resultSchema.optional()
})

const caseSchema = z.object({
  PTIURN: z.string().regex(/[A-Z0-9]{4}[0-9]{3,7}/, ExceptionCode.HO100201),
  CaseMarker: z.string().optional(),
  CPSOrganisation: organisationUnitSchema.optional(),
  PreChargeDecisionIndicator: z.string(),
  CourtReference: courtReferenceSchema,
  CourtOfAppealResult: z.string().optional(),
  ForceOwner: organisationUnitSchema.optional(),
  RecordableOnPNCindicator: z.string().optional(),
  HearingDefendant: hearingDefendantSchema.optional()
})

const hearingOutcomeSchema = z.object({
  Hearing: hearingSchema,
  Case: caseSchema
})

const annotatedHearingOutcomeSchema = z.object({
  AnnotatedHearingOutcome: z.object({
    HearingOutcome: hearingOutcomeSchema
  })
})

export { annotatedHearingOutcomeSchema }

export type AnnotatedHearingOutcome = z.infer<typeof annotatedHearingOutcomeSchema>
export type HearingOutcome = z.infer<typeof hearingOutcomeSchema>
export type Case = z.infer<typeof caseSchema>
export type Offence = z.infer<typeof offenceSchema>
export type OffenceCode = z.infer<typeof offenceCodeSchema>
export type Hearing = z.infer<typeof hearingSchema>
export type Address = z.infer<typeof addressSchema>
export type DefendantDetail = z.infer<typeof defendantDetailSchema>
export type HearingDefendant = z.infer<typeof hearingDefendantSchema>
