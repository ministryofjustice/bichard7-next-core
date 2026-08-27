import type LedsOperation from "../../../types/LedsOperation"

const logApiMetric = (
  requestUrl: string,
  durationMs: number,
  correlationId: string,
  operation: LedsOperation,
  status: number | undefined
) => {
  console.log(
    JSON.stringify({
      event: "LEDS Gateway API Call",
      requestUrl,
      operation,
      durationMs,
      correlationId,
      status
    })
  )
}

export default logApiMetric
