import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { z } from "zod"

export const eventCategorySchema = z.nativeEnum(EventCategory)
export const eventCodeSchema = z.nativeEnum(EventCode)

export const auditLogEventSchema = z.object({
  attributes: z.record(z.string(), z.unknown()).optional(),
  category: eventCategorySchema,
  eventCode: eventCodeSchema,
  eventSource: z.string(),
  eventSourceQueueName: z.string().optional(),
  eventType: z.string(),
  timestamp: z.string(),
  user: z.string().optional()
})
