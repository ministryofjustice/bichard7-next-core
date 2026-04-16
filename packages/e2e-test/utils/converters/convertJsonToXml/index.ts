import { Operation } from "../../../types/Operation"
import convertLedsAddDisposalRequestToXml from "./convertLedsAddDisposalRequestToXml"
import convertLedsAsnQueryResponseToXml from "./convertLedsAsnQueryResponseToXml"
import convertLedsRemandRequestToXml from "./convertLedsRemandRequestToXml"
import convertLedsSubsequentDisposalRequestToXmls from "./convertLedsSubsequentDisposalRequestToXmls"

const convertToXml = (code: string, data: string | undefined): string => {
  if (!data) {
    return ""
  }

  const ledsJson = JSON.parse(data)

  switch (code.toUpperCase()) {
    case Operation.AsnQueryResponse:
      return convertLedsAsnQueryResponseToXml(ledsJson)
    case Operation.Remand:
      return convertLedsRemandRequestToXml(ledsJson)
    case Operation.AddDisposal:
      return convertLedsAddDisposalRequestToXml(ledsJson)
    case Operation.SubsequentlyVaried:
    case Operation.SentenceDeferred:
      return convertLedsSubsequentDisposalRequestToXmls(ledsJson)
    default:
      throw Error(`Unknown conversion type: ${code}`)
  }
}

export default convertToXml
