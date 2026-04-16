import { z } from "zod"

export const ApiConnectivityDtoSchema = z.object({
  conductor: z.boolean(),
  database: z.boolean()
})

export type ApiConnectivityDto = z.infer<typeof ApiConnectivityDtoSchema>
