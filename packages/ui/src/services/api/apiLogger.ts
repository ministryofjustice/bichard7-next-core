import type { Logger } from "pino"

import logger from "@/utils/logger"

const apiLogger = (traceId?: string, route?: string): Logger =>
  logger.child({ traceId, route }, { msgPrefix: "[API] " })

export default apiLogger
