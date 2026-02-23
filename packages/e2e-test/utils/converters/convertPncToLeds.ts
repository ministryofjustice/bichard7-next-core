import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { SubsequentDisposalResultsRequest } from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import { convertPncXmlToJson } from "../convertPncXmlToJson"
import { convertPncJsonToLedsAddDisposalRequest } from "./convertPncJsonToLeds/convertPncJsonToLedsAddDisposalRequest"
import { convertPncJsonToLedsRemandRequest } from "./convertPncJsonToLeds/convertPncJsonToLedsRemandRequest"
import { convertPncJsonToLedsSubsequentDisposalRequest } from "./convertPncJsonToLeds/convertPncJsonToLedsSubsequentDisposalRequest"
import type {
  PncNormalDisposalJson,
  PncRemandJson,
  PncSubsequentDisposalJson
} from "./convertPncXmlToJson/convertPncXmlToJson"

export type Operation = "Remand" | "Add Disposal" | "Sentence Deferred" | "Subsequently Varied"

type PncToLedsResultMap = {
  "Add Disposal": AddDisposalRequest
  Remand: RemandRequest
  "Sentence Deferred": SubsequentDisposalResultsRequest
  "Subsequently Varied": SubsequentDisposalResultsRequest
}

export type ConvertPncToLedsResult<T extends Operation> = PncToLedsResultMap[T]

const handleSubsequentDisposal = (pncXml: string): SubsequentDisposalResultsRequest => {
  const pncJson = convertPncXmlToJson<PncSubsequentDisposalJson>(pncXml)
  return convertPncJsonToLedsSubsequentDisposalRequest(pncJson)
}

const pncXmlConverters = {
  "Add Disposal": (pncXml: string): AddDisposalRequest => {
    const pncJson = convertPncXmlToJson<PncNormalDisposalJson>(pncXml)
    return convertPncJsonToLedsAddDisposalRequest(pncJson)
  },
  Remand: (pncXml: string): RemandRequest => {
    const pncJson = convertPncXmlToJson<PncRemandJson>(pncXml)
    return convertPncJsonToLedsRemandRequest(pncJson)
  },
  "Sentence Deferred": handleSubsequentDisposal,
  "Subsequently Varied": handleSubsequentDisposal
} as const

const convertPncToLeds = <T extends Operation>(pncXml: string, operation: T): ConvertPncToLedsResult<T> => {
  const pncXmlConverter = pncXmlConverters[operation]

  if (!pncXmlConverter) {
    throw new Error(`Unsupported PNC operation: ${operation}`)
  }

  return pncXmlConverter(pncXml) as ConvertPncToLedsResult<T>
}

export default convertPncToLeds
