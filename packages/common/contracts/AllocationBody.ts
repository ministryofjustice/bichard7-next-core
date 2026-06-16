import z from "zod"

export const AllocationBodySchema = z.object({
  allocatedToUserId: z.coerce.number(),
  caseType: z.literal("exceptions").or(z.literal("triggers"))
})

export type AllocationBody = z.infer<typeof AllocationBodySchema>
