import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
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

type ConvertPncToLedsResult<T extends Operation> = T extends "ASN Query"
  ? AsnQueryResponse
  : T extends "Remand"
    ? RemandRequest
    : T extends "Add Disposal"
      ? AddDisposalRequest
      : SubsequentDisposalResultsRequest

export type Operation = "ASN Query" | "Remand" | "Add Disposal" | "Sentence Deferred" | "Subsequently Varied"

const convertPncToLeds = <T extends Operation>(pncXml: string, operation: T): ConvertPncToLedsResult<T> => {
  const getResult = () => {
    switch (operation) {
      case "Add Disposal":
        const pncNormalDisposalJson = convertPncXmlToJson<PncNormalDisposalJson>(pncXml)
        return convertPncJsonToLedsAddDisposalRequest(pncNormalDisposalJson)
      case "Remand":
        const pncRemandJson = convertPncXmlToJson<PncRemandJson>(pncXml)
        return convertPncJsonToLedsRemandRequest(pncRemandJson)
      case "Sentence Deferred":
      case "Subsequently Varied":
        const pncSubsequentDisposalJson = convertPncXmlToJson<PncSubsequentDisposalJson>(pncXml)
        return convertPncJsonToLedsSubsequentDisposalRequest(pncSubsequentDisposalJson)
      default:
        throw new Error(`Invalid operation: ${operation}`)
    }
  }

  return getResult() as ConvertPncToLedsResult<T>
}

export default convertPncToLeds
