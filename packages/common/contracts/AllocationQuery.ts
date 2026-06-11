import z from "zod"

export const AllocationQuerySchema = z.object({
  allocatedToUserId: z.coerce.number(),
  caseType: z.literal("exceptions").or(z.literal("triggers"))
})

export type AllocationQuery = z.infer<typeof AllocationQuerySchema>
