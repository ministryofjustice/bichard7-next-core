import { z } from "zod"

export const ApiConnectivityDtoSchema = z.object({
  database: z.boolean(),
  leds: z.boolean()
})

export type ApiConnectivityDto = z.infer<typeof ApiConnectivityDtoSchema>
