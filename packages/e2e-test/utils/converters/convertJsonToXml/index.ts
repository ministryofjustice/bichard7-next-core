import convertLedsAddDisposalRequestToXml from "./convertLedsAddDisposalRequestToXml"
import convertLedsAsnQueryResponseToXml from "./convertLedsAsnQueryResponseToXml"
import convertLedsRemandRequestToXml from "./convertLedsRemandRequestToXml"
import convertLedsSubsequentDisposalRequestToXmls from "./convertLedsSubsequentDisposalRequestToXmls"

const convertToXml = (code: string, data: string | undefined): string => {
  if (!data) {
    return ""
  }

  const ledsJson = JSON.parse(data)
  let result = ""

  switch (code) {
    case "CXE01":
      result = convertLedsAsnQueryResponseToXml(ledsJson)
      break
    case "CXU01":
      result = convertLedsRemandRequestToXml(ledsJson)
      break
    case "CXU02":
      result = convertLedsAddDisposalRequestToXml(ledsJson)
      break
    case "CXU04":
      result = convertLedsSubsequentDisposalRequestToXmls(ledsJson)
    default:
      throw Error(`Unknown conversion type: ${code}`)
  }

  return result
}

export default convertToXml
