import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"

const logApiMetric = (
  event: string,
  requestUrl: string,
  durationMs: number,
  correlationId: string,
  status?: number,
  operation?: PncOperation
) => {
  console.log(
    JSON.stringify({
      event,
      requestUrl,
      ...(operation && { operation }),
      duration_ms: durationMs,
      correlationId,
      status
    })
  )
}

export default logApiMetric
