import alcoholLevelMethods from "../../data/alcohol-level-method.json"
import modeOfTrialReasons from "../../data/mode-of-trial-reason.json"
import offenceCode from "../../data/offence-code.json"
import pleaStatus from "../../data/plea-status.json"
import qualifiers from "../../data/qualifier.json"
import remandStatus from "../../data/remand-status.json"
import verdicts from "../../data/verdict.json"
import type { SpiPlea } from "../types/Plea"

interface DataLookupResult {
  cjsCode: string
  description: string
  pncCode?: string
  spiCode?: string
  recordableOnPnc?: string
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

export {
  lookupRemandStatusBySpiCode,
  lookupRemandStatusByCjsCode,
  lookupPleaStatusBySpiCode,
  lookupVerdictBySpiCode,
  lookupModeOfTrialReasonBySpiCode,
  lookupResultQualifierCodeByCjsCode,
  lookupAlcoholLevelMethodBySpiCode,
  lookupOffenceCodeByCjsCode
}
