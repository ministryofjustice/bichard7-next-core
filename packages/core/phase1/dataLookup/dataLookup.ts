import type {
  ActualOffenceDate,
  CourtType,
  DefendantPresentAtHearing,
  DurationType,
  DurationUnit,
  Gender,
  ModeOfTrialReason,
  OffenceCategory,
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
} from "bichard7-next-data-latest/dist/types/types"
import type { OrganisationUnit } from "bichard7-next-data-latest/types/types"
import type { SpiPlea } from "phase1/types/Plea"
import requireStandingData from "../lib/requireStandingData"

interface DataLookupResult {
  cjsCode: string
  description: string
  pncCode?: string
  spiCode?: string
  recordableOnPnc?: string
  resultHalfLifeHours?: string | null
}

const lookupRemandStatusBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  requireStandingData().remandStatus.find((x) => x.spiCode === spiCode)

const lookupRemandStatusByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  requireStandingData().remandStatus.find((x) => x.cjsCode === cjsCode)

const lookupPleaStatusBySpiCode = (plea: SpiPlea): DataLookupResult | undefined =>
  requireStandingData().pleaStatus.find((x) => x.spiCode === plea?.toString())

const lookupPleaStatusByCjsCode = (plea: string): DataLookupResult | undefined =>
  requireStandingData().pleaStatus.find((x) => x.cjsCode === plea?.toString())

const lookupVerdictBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  requireStandingData().verdict.find((x) => x.spiCode === spiCode)

const lookupVerdictByCjsCode = (cjsCode: string): Verdict | undefined =>
  requireStandingData().verdict.find((x) => x.cjsCode === cjsCode)

const lookupModeOfTrialReasonBySpiCode = (spiCode: string): ModeOfTrialReason | undefined =>
  requireStandingData().modeOfTrialReason.find((x) => x.spiCode === spiCode)

const lookupModeOfTrialReasonByCjsCode = (cjsCode: string): ModeOfTrialReason | undefined =>
  requireStandingData().modeOfTrialReason.find((x) => x.cjsCode === cjsCode)

const lookupQualifierCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  requireStandingData().qualifier.find((x) => x.cjsCode === cjsCode)

const lookupAlcoholLevelMethodBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  requireStandingData().alcoholLevelMethod.find((x) => x.spiCode === spiCode)

const lookupAlcoholLevelMethodByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  requireStandingData().alcoholLevelMethod.find((x) => x.cjsCode === cjsCode)

const lookupOrganisationUnitByThirdLevelPsaCode = (thirdLevelPsaCode: number | string): OrganisationUnit | undefined =>
  requireStandingData().organisationUnit.find(
    (orgUnit) =>
      orgUnit.thirdLevelPsaCode.padStart(4, "0").toUpperCase() ===
      String(thirdLevelPsaCode).padStart(4, "0").toUpperCase()
  )

const forceCodeExists = (code: string): boolean =>
  requireStandingData().organisationUnit.some((ou) => ou.secondLevelCode === code)

const lookupResultCodeByCjsCode = (cjsCode: string): ResultCode | undefined =>
  requireStandingData().resultCode.find((x) => x.cjsCode === cjsCode)

const lookupPncDisposalByCjsCode = (cjsCode: string | number): PncDisposal | undefined =>
  requireStandingData().pncDisposal.find((x) => x.cjsCode === cjsCode.toString())

const lookupCourtTypeByCjsCode = (cjsCode: string): CourtType | undefined =>
  requireStandingData().courtType.find((x) => x.cjsCode === cjsCode.toString())

const lookupTypeOfHearingByCjsCode = (cjsCode: string): TypeOfHearing | undefined =>
  requireStandingData().typeOfHearing.find((x) => x.cjsCode === cjsCode.toString())

const lookupTargetCourtTypeByCjsCode = (cjsCode: string): TargetCourtType | undefined =>
  requireStandingData().targetCourtType.find((x) => x.cjsCode === cjsCode.toString())

const lookupResultClassByCjsCode = (cjsCode: string): ResultClass | undefined =>
  requireStandingData().resultClass.find((x) => x.cjsCode === cjsCode.toString())

const lookupResultQualifierCodeByCjsCode = (cjsCode: string): ResultQualifierCode | undefined =>
  requireStandingData().resultQualifierCode.find((x) => x.cjsCode === cjsCode)

const lookupDurationTypeByCjsCode = (cjsCode: string): DurationType | undefined =>
  requireStandingData().durationType.find((x) => x.cjsCode === cjsCode)

const lookupDurationUnitByCjsCode = (cjsCode: string): DurationUnit | undefined =>
  requireStandingData().durationUnit.find((x) => x.cjsCode === cjsCode)

const lookupOffenceCategoryByCjsCode = (cjsCode: string): OffenceCategory | undefined =>
  requireStandingData().offenceCategory.find((x) => x.cjsCode === cjsCode)

const lookupOffenceInitiationCodeByCjsCode = (cjsCode: string): OffenceInitiation | undefined =>
  requireStandingData().offenceInitiation.find((x) => x.cjsCode === cjsCode)

const lookupSummonsCodeByCjsCode = (cjsCode: string): Summons | undefined =>
  requireStandingData().summons.find((x) => x.cjsCode === cjsCode)

const lookupOffenceDateCodeByCjsCode = (cjsCode: string): ActualOffenceDate | undefined =>
  requireStandingData().actualOffenceDate.find((x) => x.cjsCode === cjsCode)

const lookupYesNoByCjsCode = (cjsCode: string): YesNo | undefined =>
  requireStandingData().yesNo.find((x) => x.cjsCode === cjsCode)

const lookupVehicleCodeByCjsCode = (cjsCode: string): VehicleCode | undefined =>
  requireStandingData().vehicleCode.find((x) => x.cjsCode === cjsCode)

const lookupDefendantPresentAtHearingByCjsCode = (cjsCode: string): DefendantPresentAtHearing | undefined =>
  requireStandingData().defendantPresentAtHearing.find((x) => x.cjsCode === cjsCode)

const lookupGenderByCjsCode = (cjsCode: string): Gender | undefined =>
  requireStandingData().gender.find((g) => g.cjsCode === cjsCode)

export {
  forceCodeExists,
  lookupAlcoholLevelMethodByCjsCode,
  lookupAlcoholLevelMethodBySpiCode,
  lookupCourtTypeByCjsCode,
  lookupDefendantPresentAtHearingByCjsCode,
  lookupDurationTypeByCjsCode,
  lookupDurationUnitByCjsCode,
  lookupGenderByCjsCode,
  lookupModeOfTrialReasonByCjsCode,
  lookupModeOfTrialReasonBySpiCode,
  lookupOffenceCategoryByCjsCode,
  lookupOffenceDateCodeByCjsCode,
  lookupOffenceInitiationCodeByCjsCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupPleaStatusByCjsCode,
  lookupPleaStatusBySpiCode,
  lookupPncDisposalByCjsCode,
  lookupQualifierCodeByCjsCode,
  lookupRemandStatusByCjsCode,
  lookupRemandStatusBySpiCode,
  lookupResultClassByCjsCode,
  lookupResultCodeByCjsCode,
  lookupResultQualifierCodeByCjsCode,
  lookupSummonsCodeByCjsCode,
  lookupTargetCourtTypeByCjsCode,
  lookupTypeOfHearingByCjsCode,
  lookupVehicleCodeByCjsCode,
  lookupVerdictByCjsCode,
  lookupVerdictBySpiCode,
  lookupYesNoByCjsCode
}

