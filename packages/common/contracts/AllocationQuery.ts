import z from "zod"

export const AllocationQuerySchema = z.object({
  allocatedToUserId: z.number(),
  caseType: z.string(),
  courtCaseId: z.string()
})

export type AllocationQuery = z.infer<typeof AllocationQuerySchema>
