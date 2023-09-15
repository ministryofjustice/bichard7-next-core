import { z } from "zod"
import EventCategory from "../types/EventCategory"
import EventCode from "../types/EventCode"
import toDate from "../zod/toDate"

export const eventCategorySchema = z.nativeEnum(EventCategory)
export const eventCodeSchema = z.nativeEnum(EventCode)

export const auditLogEventSchema = z.object({
  attributes: z.record(z.string(), z.unknown()).optional(),
  category: eventCategorySchema,
  eventCode: eventCodeSchema,
  eventSource: z.string(),
  eventSourceQueueName: z.string().optional(),
  eventType: z.string(),
  timestamp: z.preprocess(toDate, z.date()),
  user: z.string().optional()
})
