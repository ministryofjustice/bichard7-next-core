import type { AddDisposalRequest } from "@moj-bichard7/core/types/leds/AddDisposalRequest"
import type { AsnQueryResponse } from "@moj-bichard7/core/types/leds/AsnQueryResponse"
import type { RemandRequest } from "@moj-bichard7/core/types/leds/RemandRequest"
import type { SubsequentDisposalResultsRequest } from "@moj-bichard7/core/types/leds/SubsequentDisposalResultsRequest"
import { convertPncJsonToLedsAddDisposalRequest } from "./convertPncJsonToLeds/convertPncJsonToLedsAddDisposalRequest"
import { convertPncJsonToLedsRemandRequest } from "./convertPncJsonToLeds/convertPncJsonToLedsRemandRequest"
import type {
  PncNormalDisposalJson,
  PncRemandJson,
  PncSubsequentDisposalJson
} from "./convertPncXmlToJson/convertPncXmlToJson"
import { convertPncJsonToLedsSubsequentDisposalRequest } from "./convertPncJsonToLeds/convertPncJsonToLedsSubsequentDisposalRequest"

type ConvertPncToLedsResult<T extends Operation> = T extends "ASN Query"
  ? AsnQueryResponse
  : T extends "Remand"
    ? RemandRequest
    : T extends "Add Disposal"
      ? AddDisposalRequest
      : SubsequentDisposalResultsRequest

type Operation = "ASN Query" | "Remand" | "Add Disposal" | "Sentence Deferred" | "Subsequently Varied"

const convertPncToLeds = <T extends Operation>(
  pncXml: PncNormalDisposalJson | PncRemandJson | PncSubsequentDisposalJson,
  operation: T
): ConvertPncToLedsResult<T> => {
  const getResult = () => {
    switch (operation) {
      case "Add Disposal":
        return convertPncJsonToLedsAddDisposalRequest(pncXml as PncNormalDisposalJson)
      case "Remand":
        return convertPncJsonToLedsRemandRequest(pncXml as PncRemandJson)
      case "Sentence Deferred":
      case "Subsequently Varied":
        return convertPncJsonToLedsSubsequentDisposalRequest(pncXml as PncSubsequentDisposalJson)
      default:
        throw new Error(`Invalid operation: ${operation}`)
    }
  }

  return getResult() as ConvertPncToLedsResult<T>
}

export default convertPncToLeds
