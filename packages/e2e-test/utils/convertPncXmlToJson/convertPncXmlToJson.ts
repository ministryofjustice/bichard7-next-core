import type { Ach } from "./convertAch"
import convertAch from "./convertAch"
import type { Adj } from "./convertAdj"
import convertAdj from "./convertAdj"
import type { Asr } from "./convertAsr"
import convertAsr from "./convertAsr"
import type { Cch } from "./convertCch"
import convertCch from "./convertCch"
import type { Ccr } from "./convertCcr"
import convertCcr from "./convertCcr"
import type { Cof } from "./convertCof"
import convertCof from "./convertCof"
import type { Cou } from "./convertCou"
import convertCou from "./convertCou"
import convertCrt from "./convertCrt"
import type { Dis } from "./convertDis"
import convertDis from "./convertDis"
import type { Fsc } from "./convertFsc"
import convertFsc from "./convertFsc"
import type { Ids } from "./convertIds"
import convertIds from "./convertIds"
import convertPcr from "./convertPcr"
import convertRcc from "./convertRcc"
import type { Rem } from "./convertRem"
import convertRem from "./convertRem"

type Segment = {
  name: string
  value: string
}

const converters: Record<string, (value: string) => object | void> = {
  REM: convertRem,
  ASR: convertAsr,
  IDS: convertIds,
  PCR: convertPcr,
  RCC: convertRcc,
  FSC: convertFsc,
  CRT: convertCrt,
  CCR: convertCcr,
  COU: convertCou
}

type AsnQueryOffences = { offences: (Cof & Partial<Adj> & { disposals: Dis[] })[] }
type UpdateOffences = { offences: (Cch & Partial<Adj> & { disposals: Dis[] })[] }
type AdditionalOffences = { additionalOffences: Asr & { offences: (Ach & Partial<Adj> & { disposals: Dis[] })[] } }

export type PncAsnQueryJson = Fsc & Ids & Ccr & AsnQueryOffences
export type PncRemandJson = Fsc & Ids & Asr & Rem
export type PncNormalDisposalJson = Fsc & Ids & Ccr & Cou & UpdateOffences & AdditionalOffences
export type PncSubsequentDisposalJson = Fsc &
  Ids &
  Ccr &
  Cou &
  UpdateOffences & { type: "Sentence deferred" | "Subsequently varied" }
type PncJson = PncAsnQueryJson | PncRemandJson | PncNormalDisposalJson | PncSubsequentDisposalJson

const convertPncXmlToJson = <T extends PncJson>(segments: Segment[]): T => {
  let json = {} as T

  let offences: (Partial<(Cof | Cch | Ach) & Adj> & { disposals: Dis[] })[] = []

  converters["COF"] = (value: string): void => {
    const cof = convertCof(value)

    offences = (json as AsnQueryOffences).offences ??= []
    offences.push({ ...cof, disposals: [] })
  }

  converters["CCH"] = (value: string): void => {
    const cch = convertCch(value)

    offences = (json as UpdateOffences).offences ??= []
    offences.push({ ...cch, disposals: [] })
  }

  converters["ACH"] = (value: string): void => {
    const ach = convertAch(value)

    offences = ((json as AdditionalOffences).additionalOffences ??= {
      arrestSummonsNumber: "",
      crimeOffenceReferenceNo: "",
      offences: []
    }).offences
    offences.push({ ...ach, disposals: [] })
  }

  converters["ADJ"] = (value: string): void => {
    const adj = convertAdj(value)

    if (offences.length) {
      Object.assign(offences[offences.length - 1], adj)
    }
  }

  converters["DIS"] = (value: string): void => {
    const dis = convertDis(value)

    if (offences.length) {
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

  return json
}

export default convertPncXmlToJson
