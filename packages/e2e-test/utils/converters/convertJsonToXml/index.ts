import convertLedsAddDisposalRequestToXml from "./convertLedsAddDisposalRequestToXml"
import convertLedsAsnQueryResponseToXml from "./convertLedsAsnQueryResponseToXml"
import convertLedsRemandRequestToXml from "./convertLedsRemandRequestToXml"
import convertLedsSubsequentDisposalRequestToXmls from "./convertLedsSubsequentDisposalRequestToXmls"

const convertToXml = (code: string, data: string | undefined): string => {
  if (!data) {
    return ""
  }

  const ledsJson = JSON.parse(data)

  switch (code) {
    case "CXE01":
      return convertLedsAsnQueryResponseToXml(ledsJson)
    case "CXU01":
      return convertLedsRemandRequestToXml(ledsJson)
    case "CXU02":
      return convertLedsAddDisposalRequestToXml(ledsJson)
    case "CXU04":
      return convertLedsSubsequentDisposalRequestToXmls(ledsJson)
    default:
      throw Error(`Unknown conversion type: ${code}`)
  }
}

export default convertToXml
