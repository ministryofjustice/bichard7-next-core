import { z } from "zod"

export const eventSchema = z.object({
  detail: z.object({
    bucket: z.object({ name: z.string() }),
    object: z.object({ key: z.string() })
  })
})

export const batchEventSchema = z.array(eventSchema)

export type CompareSingleLambdaEvent = z.infer<typeof eventSchema>
export type CompareBatchLambdaEvent = z.infer<typeof batchEventSchema>
