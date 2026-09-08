import z from "zod"

export const ResolveBodySchema = z.object({
  courtCaseErrorStatus: z.enum(["Resolved", "Submitted", "Unresolved"]),
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
