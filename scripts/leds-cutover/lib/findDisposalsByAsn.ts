import { randomUUID } from "crypto"
import { Agent, fetch } from "undici"
import generateRequestHeaders from "../../../packages/core/lib/policeGateway/leds/generateRequestHeaders"
import LedsActionCode from "../../../packages/core/types/leds/LedsActionCode"
import generateNiamAuthToken from "./generateNiamAuthToken"

const findDisposalsByAsn = async (asn: string) => {
  const authToken = await generateNiamAuthToken()
  if (authToken instanceof Error) {
    console.error(authToken)
    process.exit(1)
  }

  const shouldSkipTlsVerification = !["production", "preprod"].includes(process.env.WORKSPACE!)
  const dispatcher = shouldSkipTlsVerification
    ? new Agent({
        connect: {
          rejectUnauthorized: false
        }
      })
    : undefined

  const requestHeaders = generateRequestHeaders(randomUUID(), LedsActionCode.QueryByAsn, authToken)
  const requestBody = {
    asn,
    caseStatusMarkers: ["impending-prosecution-detail", "penalty-notice", "court-case"]
  }
  const asnQueryResponse = await fetch(process.env.ASN_QUERY_URL!, {
    headers: requestHeaders,
    method: "POST",
    dispatcher,
    body: JSON.stringify(requestBody)
  })
    .then((response) => response.json())
    .catch((error: Error) => error)

  return asnQueryResponse
}

export default findDisposalsByAsn
