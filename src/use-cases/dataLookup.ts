import nextData from "@moj-bichard7-developers/bichard7-next-data"
import type { OffenceCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
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
  verdict
} = nextData

interface DataLookupResult {
  cjsCode: string
  description: string
  pncCode?: string
  spiCode?: string
  recordableOnPnc?: string
  resultHalfLifeHours?: string | null
}

interface PncDisposalDataLookupResult {
  cjsCode: string
  description: string
  pncAdjudication: string
  pncNonAdjudication: string
}

const lookupRemandStatusBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  remandStatus.find((x) => x.spiCode === spiCode)

const lookupRemandStatusByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  remandStatus.find((x) => x.cjsCode === cjsCode)

const lookupPleaStatusBySpiCode = (plea: SpiPlea): DataLookupResult | undefined =>
  pleaStatus.find((x) => x.spiCode === plea?.toString())

const lookupVerdictBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  verdict.find((x) => x.spiCode === spiCode)

const lookupModeOfTrialReasonBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  modeOfTrialReason.find((x) => x.spiCode === spiCode)

const lookupResultQualifierCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
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

const lookupResultCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  resultCode.find((x) => x.cjsCode === cjsCode)

const lookupPncDisposalByCjsCode = (cjsCode: string | number): PncDisposalDataLookupResult | undefined =>
  pncDisposal.find((x) => x.cjsCode === cjsCode.toString())

export {
  lookupRemandStatusBySpiCode,
  lookupRemandStatusByCjsCode,
  lookupPleaStatusBySpiCode,
  lookupVerdictBySpiCode,
  lookupModeOfTrialReasonBySpiCode,
  lookupResultQualifierCodeByCjsCode,
  lookupAlcoholLevelMethodBySpiCode,
  lookupOffenceCodeByCjsCode,
  lookupOrganisationUnitByCode,
  lookupOrganisationUnitByThirdLevelPsaCode,
  lookupResultCodeByCjsCode,
  lookupPncDisposalByCjsCode
}
