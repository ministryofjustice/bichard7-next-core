import nextData from "@moj-bichard7-developers/bichard7-next-data"
import type {
  CourtType,
  DurationType,
  DurationUnit,
  ModeOfTrialReason,
  OffenceCode,
  PncDisposal,
  ResultClass,
  ResultCode,
  ResultQualifierCode,
  TargetCourtType,
  TypeOfHearing,
  Verdict
} from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import type OrganisationUnitData from "src/types/OrganisationUnitData"
import type { SpiPlea } from "src/types/Plea"

const {
  alcoholLevelMethod,
  modeOfTrialReason,
  organisationUnit,
  pleaStatus,
  pncDisposal,
  qualifier,
  remandStatus,
  resultCode,
  offenceCode,
  verdict,
  courtType,
  typeOfHearing,
  targetCourtType,
  resultClass,
  resultQualifierCode,
  durationType,
  durationUnit
} = nextData

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

const lookupOffenceCodeByCjsCode = (cjsCode: string): OffenceCode | undefined =>
  offenceCode.find((x) => x.cjsCode === cjsCode)

const lookupOrganisationUnitByCode = (orgUnit: OrganisationUnit): OrganisationUnitData | undefined => {
  if (!orgUnit) {
    return undefined
  }

  const result = organisationUnit.filter(
    (unit) =>
      unit.topLevelCode.toUpperCase() === (orgUnit.TopLevelCode?.toUpperCase() ?? "") &&
      unit.secondLevelCode.toUpperCase() === orgUnit.SecondLevelCode?.toUpperCase() &&
      unit.thirdLevelCode.toUpperCase() === orgUnit.ThirdLevelCode?.toUpperCase()
  )

  return result.find((unit) => unit.bottomLevelCode === orgUnit.BottomLevelCode) ?? result?.[0]
}

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

export {
  lookupRemandStatusBySpiCode,
  lookupRemandStatusByCjsCode,
  lookupPleaStatusBySpiCode,
  lookupVerdictBySpiCode,
  lookupVerdictByCjsCode,
  lookupModeOfTrialReasonBySpiCode,
  lookupModeOfTrialReasonByCjsCode,
  lookupQualifierCodeByCjsCode,
  lookupAlcoholLevelMethodBySpiCode,
  lookupOffenceCodeByCjsCode,
  lookupOrganisationUnitByCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupResultCodeByCjsCode,
  lookupPncDisposalByCjsCode,
  lookupCourtTypeByCjsCode,
  lookupTypeOfHearingByCjsCode,
  lookupTargetCourtTypeByCjsCode,
  lookupResultClassByCjsCode,
  lookupResultQualifierCodeByCjsCode,
  lookupDurationTypeByCjsCode,
  lookupDurationUnitByCjsCode
}
