import {
  actualOffenceDate,
  alcoholLevelMethod,
  courtType,
  defendantPresentAtHearing,
  durationType,
  durationUnit,
  modeOfTrialReason,
  offenceCategory,
  offenceCode,
  offenceInitiation,
  organisationUnit,
  pleaStatus,
  pncDisposal,
  qualifier,
  remandStatus,
  resultClass,
  resultCode,
  resultQualifierCode,
  summons,
  targetCourtType,
  typeOfHearing,
  vehicleCode,
  verdict,
  yesNo
} from "@moj-bichard7-developers/bichard7-next-data"
import type {
  ActualOffenceDate,
  CourtType,
  DefendantPresentAtHearing,
  DurationType,
  DurationUnit,
  ModeOfTrialReason,
  OffenceCategory,
  OffenceCode,
  OffenceInitiation,
  PncDisposal,
  ResultClass,
  ResultCode,
  ResultQualifierCode,
  Summons,
  TargetCourtType,
  TypeOfHearing,
  VehicleCode,
  Verdict,
  YesNo
} from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import type OrganisationUnitData from "src/types/OrganisationUnitData"
import type { SpiPlea } from "src/types/Plea"

interface DataLookupResult {
  cjsCode: string
  description: string
  pncCode?: string
  spiCode?: string
  recordableOnPnc?: string
  resultHalfLifeHours?: string | null
}

const lookupRemandStatusBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  remandStatus.find((x) => x.spiCode === spiCode)

const lookupRemandStatusByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  remandStatus.find((x) => x.cjsCode === cjsCode)

const lookupPleaStatusBySpiCode = (plea: SpiPlea): DataLookupResult | undefined =>
  pleaStatus.find((x) => x.spiCode === plea?.toString())

const lookupPleaStatusByCjsCode = (plea: string): DataLookupResult | undefined =>
  pleaStatus.find((x) => x.cjsCode === plea?.toString())

const lookupVerdictBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  verdict.find((x) => x.spiCode === spiCode)

const lookupVerdictByCjsCode = (cjsCode: string): Verdict | undefined => verdict.find((x) => x.cjsCode === cjsCode)

const lookupModeOfTrialReasonBySpiCode = (spiCode: string): ModeOfTrialReason | undefined =>
  modeOfTrialReason.find((x) => x.spiCode === spiCode)

const lookupModeOfTrialReasonByCjsCode = (cjsCode: string): ModeOfTrialReason | undefined =>
  modeOfTrialReason.find((x) => x.cjsCode === cjsCode)

const lookupQualifierCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  qualifier.find((x) => x.cjsCode === cjsCode)

const lookupAlcoholLevelMethodBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  alcoholLevelMethod.find((x) => x.spiCode === spiCode)

const lookupOrganisationUnitByThirdLevelPsaCode = (
  thirdLevelPsaCode: number | string
): OrganisationUnitData | undefined =>
  organisationUnit.find(
    (orgUnit) => orgUnit.thirdLevelPsaCode.toUpperCase() === String(thirdLevelPsaCode).padStart(4, "0").toUpperCase()
  )

const lookupResultCodeByCjsCode = (cjsCode: string): ResultCode | undefined =>
  resultCode.find((x) => x.cjsCode === cjsCode)

const lookupPncDisposalByCjsCode = (cjsCode: string | number): PncDisposal | undefined =>
  pncDisposal.find((x) => x.cjsCode === cjsCode.toString())

const lookupCourtTypeByCjsCode = (cjsCode: string): CourtType | undefined =>
  courtType.find((x) => x.cjsCode === cjsCode.toString())

const lookupTypeOfHearingByCjsCode = (cjsCode: string): TypeOfHearing | undefined =>
  typeOfHearing.find((x) => x.cjsCode === cjsCode.toString())

const lookupTargetCourtTypeByCjsCode = (cjsCode: string): TargetCourtType | undefined =>
  targetCourtType.find((x) => x.cjsCode === cjsCode.toString())

const lookupResultClassByCjsCode = (cjsCode: string): ResultClass | undefined =>
  resultClass.find((x) => x.cjsCode === cjsCode.toString())

const lookupResultQualifierCodeByCjsCode = (cjsCode: string): ResultQualifierCode | undefined =>
  resultQualifierCode.find((x) => x.cjsCode === cjsCode)

const lookupDurationTypeByCjsCode = (cjsCode: string): DurationType | undefined =>
  durationType.find((x) => x.cjsCode === cjsCode)

const lookupDurationUnitByCjsCode = (cjsCode: string): DurationUnit | undefined =>
  durationUnit.find((x) => x.cjsCode === cjsCode)

const lookupOffenceCategoryByCjsCode = (cjsCode: string): OffenceCategory | undefined =>
  offenceCategory.find((x) => x.cjsCode === cjsCode)

const lookupOffenceInitiationCodeByCjsCode = (cjsCode: string): OffenceInitiation | undefined =>
  offenceInitiation.find((x) => x.cjsCode === cjsCode)

const lookupSummonsCodeByCjsCode = (cjsCode: string): Summons | undefined => summons.find((x) => x.cjsCode === cjsCode)

const lookupOffenceDateCodeByCjsCode = (cjsCode: string): ActualOffenceDate | undefined =>
  actualOffenceDate.find((x) => x.cjsCode === cjsCode)

const lookupYesNoByCjsCode = (cjsCode: string): YesNo | undefined => yesNo.find((x) => x.cjsCode === cjsCode)

const lookupVehicleCodeByCjsCode = (cjsCode: string): VehicleCode | undefined =>
  vehicleCode.find((x) => x.cjsCode === cjsCode)

const lookupOffenceByCjsCode = (cjsCode: string): OffenceCode | undefined =>
  offenceCode.find((x) => x.cjsCode === cjsCode)

const lookupDefendantPresentAtHearingByCjsCode = (cjsCode: string): DefendantPresentAtHearing | undefined =>
  defendantPresentAtHearing.find((x) => x.cjsCode === cjsCode)

export {
  lookupRemandStatusBySpiCode,
  lookupRemandStatusByCjsCode,
  lookupPleaStatusBySpiCode,
  lookupPleaStatusByCjsCode,
  lookupVerdictBySpiCode,
  lookupVerdictByCjsCode,
  lookupModeOfTrialReasonBySpiCode,
  lookupModeOfTrialReasonByCjsCode,
  lookupQualifierCodeByCjsCode,
  lookupAlcoholLevelMethodBySpiCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupResultCodeByCjsCode,
  lookupPncDisposalByCjsCode,
  lookupCourtTypeByCjsCode,
  lookupTypeOfHearingByCjsCode,
  lookupTargetCourtTypeByCjsCode,
  lookupResultClassByCjsCode,
  lookupResultQualifierCodeByCjsCode,
  lookupDurationTypeByCjsCode,
  lookupDurationUnitByCjsCode,
  lookupOffenceCategoryByCjsCode,
  lookupOffenceInitiationCodeByCjsCode,
  lookupSummonsCodeByCjsCode,
  lookupVehicleCodeByCjsCode,
  lookupYesNoByCjsCode,
  lookupOffenceDateCodeByCjsCode,
  lookupOffenceByCjsCode,
  lookupDefendantPresentAtHearingByCjsCode
}
