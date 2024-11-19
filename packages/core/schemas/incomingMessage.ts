import { z } from "zod"

export const incomingMessageSchema = z.object({
  RouteData: z.object({
    DataStream: z.object({
      DataStreamContent: z.string(),
      System: z.string()
    }),
    RequestFromSystem: z.object({
      CorrelationID: z.string(),
      SourceID: z.string().optional()
    })
  })
})
