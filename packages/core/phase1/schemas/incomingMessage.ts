import { z } from "zod"

export const incomingMessageSchema = z.object({
  RouteData: z.object({
    RequestFromSystem: z.object({
      CorrelationID: z.string(),
      SourceID: z.string()
    }),
    DataStream: z.object({
      DataStreamContent: z.string()
    })
  })
})
