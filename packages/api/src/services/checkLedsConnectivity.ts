import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import httpStatus from "http-status"
import { Agent, fetch } from "undici"

const insecureAgent = new Agent({
  connect: {
    rejectUnauthorized: false
  }
})

export default async (): PromiseResult<boolean> => {
  const ledsApiUrl = process.env.LEDS_API_URL

  if (!ledsApiUrl) {
    console.error("LEDS_API_URL environment variable not found")
    return false
  }

  const response = await fetch(ledsApiUrl, {
    dispatcher: insecureAgent,
    method: "POST",
    signal: AbortSignal.timeout(2_000)
  }).catch((error: Error) => error)

  if (isError(response)) {
    return false
  }

  return response.status === httpStatus.UNAUTHORIZED
}
