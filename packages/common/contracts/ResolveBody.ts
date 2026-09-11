import z from "zod"

export const ResolveBodySchema = z.object({
  reason: z.enum([
    "UpdatedDisposal",
    "UpdatedRemand",
    "UpdatedDisposalAndRemand",
    "PNCRecordIsAccurate",
    "NonRecordable",
    "Reallocated"
  ]),
  reasonText: z.string().optional(),
  resolutionStatus: z.enum(["Resolved", "Submitted", "Unresolved"])
})

export type ResolveBody = z.infer<typeof ResolveBodySchema>
