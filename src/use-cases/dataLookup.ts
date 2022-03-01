import type { Plea } from "src/types/Plea"
import remandStatus from "../../data/remand-status.json"
import pleaStatus from "../../data/plea-status.json"
import verdicts from "../../data/verdict.json"
import modeOfTrialReasons from "../../data/mode-of-trial-reason.json"
import qualifiers from "../../data/qualifier.json"
import alcoholLevelMethods from "../../data/alcohol-level-method.json"

interface DataLookupResult {
  cjsCode: string
  description: string
  pncCode?: string
  spiCode?: string
}

const lookupRemandStatusBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  remandStatus.find((x) => x.spiCode === spiCode)

const lookupPleaStatusBySpiCode = (plea: Plea): DataLookupResult | undefined =>
  pleaStatus.find((x) => x.spiCode === plea?.toString())

const lookupVerdictBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  verdicts.find((x) => x.spiCode === spiCode)

const lookupModeOfTrialReasonBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  modeOfTrialReasons.find((x) => x.spiCode === spiCode)

const lookupResultQualifierCodeByCjsCode = (cjsCode: string): DataLookupResult | undefined =>
  qualifiers.find((x) => x.cjsCode === cjsCode)

const lookupAlcoholLevelMethodBySpiCode = (spiCode: string): DataLookupResult | undefined =>
  alcoholLevelMethods.find((x) => x.spiCode === spiCode)

export {
  lookupRemandStatusBySpiCode,
  lookupPleaStatusBySpiCode,
  lookupVerdictBySpiCode,
  lookupModeOfTrialReasonBySpiCode,
  lookupResultQualifierCodeByCjsCode,
  lookupAlcoholLevelMethodBySpiCode
}
