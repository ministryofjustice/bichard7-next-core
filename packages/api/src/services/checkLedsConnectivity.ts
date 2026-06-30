import type { Dispatcher } from "undici"

import { type PromiseResult } from "@moj-bichard7/common/types/Result"
import httpStatus from "http-status"
import { fetch } from "undici"

export default async (dispatcher?: Dispatcher, fetchFn: typeof fetch = fetch): PromiseResult<boolean> => {
  const ledsApiUrl = process.env.LEDS_API_URL

  if (!ledsApiUrl) {
    console.error("LEDS_API_URL environment variable not found")
    return false
  }

  const fetchOptions = {
    method: "POST",
    signal: AbortSignal.timeout(2_000),
    ...(dispatcher && { dispatcher })
  }

  try {
    const response = await fetchFn(ledsApiUrl, fetchOptions)
    return response.status === httpStatus.UNAUTHORIZED
  } catch (error) {
    console.error("Connectivity check failed:", error)
    return false
  }
}
