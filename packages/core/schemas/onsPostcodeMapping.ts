import { z } from "zod"

export const onsPostcodeMappingRowSchema = z.object({
  police_force_area: z.string(),
  postcode: z.string()
})

export type onsPostcodeMappingRow = z.infer<typeof onsPostcodeMappingRowSchema>
