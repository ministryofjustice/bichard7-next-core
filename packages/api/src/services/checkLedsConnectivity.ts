import type { PromiseResult } from "@moj-bichard7/common/types/Result"

export default async (): PromiseResult<boolean> => {
  const ledsApiUrl = process.env.LEDS_API_URL

  if (!ledsApiUrl) {
    console.error("LEDS_API_URL environment variable not found")
    return false
  }

  let timerId: NodeJS.Timeout | undefined

  try {
    const timeout = new Promise((_, reject) => {
      timerId = setTimeout(() => reject(new Error("Timeout")), 2000)
    })

    const fetchPromise = fetch(ledsApiUrl, { method: "GET" })

    const response = (await Promise.race([fetchPromise, timeout])) as Response

    return response.ok
  } catch {
    return false
  } finally {
    if (timerId) {
      clearTimeout(timerId)
    }
  }
}
