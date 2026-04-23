import { Operation } from "../../../types/Operation"
import convertLedsAddDisposalRequestToXml from "./convertLedsAddDisposalRequestToXml"
import convertLedsAsnQueryResponseToXml from "./convertLedsAsnQueryResponseToXml"
import convertLedsRemandRequestToXml from "./convertLedsRemandRequestToXml"
import convertLedsSubsequentDisposalRequestToXmls from "./convertLedsSubsequentDisposalRequestToXmls"

const convertToXml = (code: string, data: string | object | undefined): string => {
  if (!data) {
    return ""
  }

  const mockJson = typeof data === "string" ? JSON.parse(data) : data

  switch (code.toUpperCase()) {
    case Operation.AsnQueryResponse:
      return convertLedsAsnQueryResponseToXml(mockJson)
    case Operation.Remand:
      return convertLedsRemandRequestToXml(mockJson)
    case Operation.AddDisposal:
      return convertLedsAddDisposalRequestToXml(mockJson)
    case Operation.SubsequentlyVaried:
    case Operation.SentenceDeferred:
      return convertLedsSubsequentDisposalRequestToXmls(mockJson)
    default:
      throw Error(`Unknown conversion type: ${code}`)
  }
}

export default convertToXml
