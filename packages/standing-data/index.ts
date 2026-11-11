import actualOffenceDateData from "./data/actual-offence-date.json"
import alcoholLevelMethodData from "./data/alcohol-level-method.json"
import amountData from "./data/amount.json"
import countryData from "./data/country.json"
import courtTypeData from "./data/court-type.json"
import crestDisposalData from "./data/crest-disposal.json"
import defendantPresentAtHearingData from "./data/defendant-present-at-hearing.json"
import durationTypeData from "./data/duration-type.json"
import durationUnitData from "./data/duration-unit.json"
import exceptionDefinitionData from "./data/exception-definitions.json"
import excudedTriggerConfigData from "./data/excluded-trigger-config.json"
import forcesData from "./data/forces.json"
import genderData from "./data/gender.json"
import modeOfTrialReasonData from "./data/mode-of-trial-reason.json"
import numberData from "./data/number.json"
import offenceCategoryData from "./data/offence-category.json"
import offenceCodeData from "./data/offence-code.json"
import offenceInitiationData from "./data/offence-initiation.json"
import organisationUnitData from "./data/organisation-unit.json"
import pleaStatusData from "./data/plea-status.json"
import pncCourtMappingData from "./data/pnc-court-mapping.json"
import pncDisposalData from "./data/pnc-disposal.json"
import qualifierData from "./data/qualifier.json"
import remandStatusData from "./data/remand-status.json"
import resultClassData from "./data/result-class.json"
import resultCodeData from "./data/result-code.json"
import resultQualifierCodeData from "./data/result-qualifier-code.json"
import summonsData from "./data/summons.json"
import targetCourtTypeData from "./data/target-court-type.json"
import triggerDefinitionData from "./data/trigger-definitions.json"
import typeOfHearingData from "./data/type-of-hearing.json"
import vehicleCodeData from "./data/vehicle-code.json"
import verdictData from "./data/verdict.json"
import yesNoData from "./data/yes-no.json"
import forceCatchmentAreasData from "./data/force-catchment-areas.json"
import GroupedTriggerCodes from "./types/GroupedTriggerCodes"
import type {
  ActualOffenceDate,
  AlcoholLevelMethod,
  Amount,
  Country,
  CourtType,
  CrestDisposal,
  DefendantPresentAtHearing,
  DurationType,
  DurationUnit,
  ExceptionDefinition,
  ExcludedTriggerConfig,
  Force,
  ForceCatchmentArea,
  Gender,
  ModeOfTrialReason,
  Number as NumberData,
  OffenceCategory,
  OffenceCode,
  OffenceInitiation,
  OrganisationUnit,
  PleaStatus,
  PncCourtMapping,
  PncDisposal,
  Qualifier,
  RemandStatus,
  ResultClass,
  ResultCode,
  ResultQualifierCode,
  Summons,
  TargetCourtType,
  TriggerDefinition,
  TypeOfHearing,
  VehicleCode,
  Verdict,
  YesNo
} from "./types/types"

export const actualOffenceDate: ActualOffenceDate[] = actualOffenceDateData
export const alcoholLevelMethod: AlcoholLevelMethod[] = alcoholLevelMethodData
export const amount: Amount[] = amountData
export const country: Country[] = countryData
export const courtType: CourtType[] = courtTypeData
export const crestDisposal: CrestDisposal[] = crestDisposalData
export const defendantPresentAtHearing: DefendantPresentAtHearing[] = defendantPresentAtHearingData
export const durationType: DurationType[] = durationTypeData
export const durationUnit: DurationUnit[] = durationUnitData
export const excludedTriggerConfig = excudedTriggerConfigData as ExcludedTriggerConfig
export const forces = forcesData as Force[]
export const gender: Gender[] = genderData
export const modeOfTrialReason: ModeOfTrialReason[] = modeOfTrialReasonData
export const number: NumberData[] = numberData
export const offenceCategory: OffenceCategory[] = offenceCategoryData
export const offenceCode: OffenceCode[] = offenceCodeData
export const offenceInitiation: OffenceInitiation[] = offenceInitiationData
export const organisationUnit: OrganisationUnit[] = organisationUnitData
export const pleaStatus: PleaStatus[] = pleaStatusData
export const pncCourtMapping: PncCourtMapping[] = pncCourtMappingData
export const pncDisposal: PncDisposal[] = pncDisposalData
export const qualifier: Qualifier[] = qualifierData
export const remandStatus: RemandStatus[] = remandStatusData
export const resultClass: ResultClass[] = resultClassData
export const resultCode: ResultCode[] = resultCodeData
export const resultQualifierCode: ResultQualifierCode[] = resultQualifierCodeData
export const summons: Summons[] = summonsData
export const targetCourtType: TargetCourtType[] = targetCourtTypeData
export const triggerDefinitions = triggerDefinitionData as TriggerDefinition[]
export const exceptionDefinitions = exceptionDefinitionData as ExceptionDefinition[]
export const typeOfHearing: TypeOfHearing[] = typeOfHearingData
export const vehicleCode: VehicleCode[] = vehicleCodeData
export const verdict: Verdict[] = verdictData
export const yesNo: YesNo[] = yesNoData
export const forceCatchmentAreas: ForceCatchmentArea = forceCatchmentAreasData

export default {
  actualOffenceDate,
  alcoholLevelMethod,
  amount,
  country,
  courtType,
  crestDisposal,
  defendantPresentAtHearing,
  durationType,
  durationUnit,
  exceptionDefinitions,
  excludedTriggerConfig,
  forces,
  gender,
  modeOfTrialReason,
  number,
  offenceCategory,
  offenceCode,
  offenceInitiation,
  organisationUnit,
  pleaStatus,
  pncCourtMapping,
  pncDisposal,
  qualifier,
  remandStatus,
  resultClass,
  resultCode,
  resultQualifierCode,
  summons,
  targetCourtType,
  triggerDefinitions,
  typeOfHearing,
  vehicleCode,
  verdict,
  yesNo,
  forceCatchmentAreas,
  GroupedTriggerCodes
}
