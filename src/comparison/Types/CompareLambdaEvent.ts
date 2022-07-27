import { z } from "zod"

const eventSchema = z.object({
  detail: z.object({
    bucket: z.object({ name: z.string() }),
    object: z.object({ key: z.string() })
  })
})

export type CompareLambdaEvent = z.infer<typeof eventSchema>

export { eventSchema }
