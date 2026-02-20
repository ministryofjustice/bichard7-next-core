import type { Ach } from "./convertAch"
import convertAch from "./convertAch"
import type { Adj } from "./convertAdj"
import convertAdj from "./convertAdj"
import type { Asr } from "./convertAsr"
import convertAsr from "./convertAsr"
import type { Cch } from "./convertCch"
import convertCch from "./convertCch"
import convertCcr from "./convertCcr"
import type { Cof } from "./convertCof"
import convertCof from "./convertCof"
import type { Cou } from "./convertCou"
import convertCou from "./convertCou"
import type { Crt } from "./convertCrt"
import convertCrt from "./convertCrt"
import type { Dis } from "./convertDis"
import convertDis from "./convertDis"
import type { Fsc } from "./convertFsc"
import convertFsc from "./convertFsc"
import type { Ids } from "./convertIds"
import convertIds from "./convertIds"
import convertPcr from "./convertPcr"
import type { Rcc } from "./convertRcc"
import convertRcc from "./convertRcc"
import type { Rem } from "./convertRem"
import convertRem from "./convertRem"
import type { Sub } from "./convertSub"
import convertSub from "./convertSub"
import type { Txt } from "./convertTxt"
import convertTxt from "./convertTxt"
import extractSegments from "./extractSegments"

const converters: Record<string, (value: string) => object | void> = {
  TXT: convertTxt,
  REM: convertRem,
  ASR: convertAsr,
  IDS: convertIds,
  PCR: convertPcr,
  FSC: convertFsc,
  COU: convertCou
}

type AsnQueryOffences = { offences: (Cof & Partial<Adj> & { disposals: Dis[]; courtCaseReference: string })[] }
type UpdateOffences = { offences: (Cch & Partial<Adj> & { disposals: Dis[]; courtCaseReference: string })[] }
type AdditionalOffences = {
  additionalOffences: Asr & { offences: (Ach & Partial<Adj> & { disposals: Dis[]; courtCaseReference: string })[] }
}

export type PncAsnQueryJson = (Fsc & Ids & AsnQueryOffences) | Txt
export type PncRemandJson = Fsc & Ids & Asr & Rem
export type PncNormalDisposalJson = Fsc &
  Ids &
  Cou & { carryForward?: Crt } & { referToCourtCase?: Rcc } & UpdateOffences &
  AdditionalOffences
export type PncSubsequentDisposalJson = Fsc &
  Ids &
  Cou & { subsequentUpdate: Sub } & UpdateOffences & { type: "Sentence deferred" | "Subsequently varied" }
type PncJson = PncAsnQueryJson | PncRemandJson | PncNormalDisposalJson | PncSubsequentDisposalJson

const convertPncXmlToJson = <T extends PncJson>(xml: string): T => {
  const segments = extractSegments(xml)
  let json = {} as T

  let courtCaseReference: string = ""
  let offences: (Partial<(Cof | Cch) & Adj> & { disposals: Dis[]; courtCaseReference: string })[] = []
  const additionalOffences: AdditionalOffences | undefined = undefined

  converters["CCR"] = (value: string) => {
    const ccr = convertCcr(value)

    courtCaseReference = ccr.courtCaseReferenceNumber
  }

  converters["CRT"] = (value: string) => {
    const crt = convertCrt(value)

    ;(json as PncNormalDisposalJson).carryForward = crt
  }

  converters["RCC"] = (value: string) => {
    const rcc = convertRcc(value)

    ;(json as PncNormalDisposalJson).referToCourtCase = rcc
  }

  converters["SUB"] = (value: string) => {
    const sub = convertSub(value)

    ;(json as PncSubsequentDisposalJson).subsequentUpdate = sub
  }

  converters["COF"] = (value: string): void => {
    const cof = convertCof(value)

    offences = (json as AsnQueryOffences).offences ??= []
    offences.push({ ...cof, disposals: [], courtCaseReference })
  }

  converters["CCH"] = (value: string): void => {
    const cch = convertCch(value)

    offences = (json as UpdateOffences).offences ??= []
    offences.push({ ...cch, disposals: [], courtCaseReference })
  }

  converters["ACH"] = (value: string): void => {
    const ach = convertAch(value)

    ;(json as AdditionalOffences).additionalOffences ??= {
      arrestSummonsNumber: "",
      crimeOffenceReferenceNo: "",
      offences: []
    }
    ;(json as AdditionalOffences).additionalOffences.offences.push({ ...ach, disposals: [], courtCaseReference })
  }

  converters["ADJ"] = (value: string): void => {
    const adj = convertAdj(value)

    if (offences.length > 0) {
      Object.assign(offences[offences.length - 1], adj)
    }
  }

  converters["DIS"] = (value: string): void => {
    const dis = convertDis(value)

    if (offences.length > 0) {
      offences[offences.length - 1].disposals.push(dis)
    }
  }

  for (const { name, value } of segments) {
    const converted = converters[name]?.(value)
    if (!converted) {
      continue
    }

    json = { ...json, ...converted }
  }

  json = { ...json, ...offences, ...(additionalOffences ?? {}) }

  return json
}

export default convertPncXmlToJson
