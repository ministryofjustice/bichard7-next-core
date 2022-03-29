import type { OrganisationUnit } from "src/types/AnnotatedHearingOutcome"
import type OrganisationUnitData from "src/types/OrganisationUnitData"
import alcoholLevelMethods from "../../data/alcohol-level-method.json"
import modeOfTrialReasons from "../../data/mode-of-trial-reason.json"
import offenceCode from "../../data/offence-code.json"
import organisationUnits from "../../data/organisation-unit.json"
import pleaStatus from "../../data/plea-status.json"
import qualifiers from "../../data/qualifier.json"
import remandStatus from "../../data/remand-status.json"
import resultCodes from "../../data/result-codes.json"
import verdicts from "../../data/verdict.json"
import pncDisposals from "../../data/pnc-disposal.json"
import type { SpiPlea } from "../types/Plea"

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
  verdicts.find((x) => x.spiCode === spiCode)

const lookupModeOfTrialReasonBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  modeOfTrialReasons.find((x) => x.spiCode === spiCode)

const lookupResultQualifierCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  qualifiers.find((x) => x.cjsCode === cjsCode)

const lookupAlcoholLevelMethodBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  alcoholLevelMethods.find((x) => x.spiCode === spiCode)

const lookupOffenceCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  offenceCode.find((x) => x.cjsCode === cjsCode)

const lookupOrganisationUnitByCode = (organisationUnit: OrganisationUnit): OrganisationUnitData | undefined => {
  if (!organisationUnit) {
    return undefined
  }

  const result = organisationUnits.filter(
    (unit) =>
      unit.topLevelCode.toUpperCase() === organisationUnit.TopLevelCode?.toUpperCase() &&
      unit.secondLevelCode.toUpperCase() === organisationUnit.SecondLevelCode?.toUpperCase() &&
      unit.thirdLevelCode.toUpperCase() === organisationUnit.ThirdLevelCode?.toUpperCase()
  )

  return result.find((unit) => unit.bottomLevelCode === organisationUnit.BottomLevelCode) ?? result?.[0]
}

const lookupOrganisationUnitByThirdLevelPsaCode = (thirdLevelPsaCode: number): OrganisationUnitData | undefined =>
  organisationUnits.find(
    (organisationUnit) =>
      organisationUnit.thirdLevelPsaCode.toUpperCase() === String(thirdLevelPsaCode).padStart(4, "0").toUpperCase()
  )

const lookupResultCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  resultCodes.find((x) => x.cjsCode === cjsCode)

const lookupPncDisposalByCjsCode = (cjsCode: string | number): PncDisposalDataLookupResult | undefined =>
  pncDisposals.find((x) => x.cjsCode === cjsCode.toString())

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
