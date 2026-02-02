import z from "zod"

export const AuditSchema = z.object({
  auditId: z.number(),
  completedWhen: z.date(),
  createdBy: z.string(),
  createdWhen: z.date(),
  fromDate: z.date(),
  includedTypes: z.enum(["Triggers", "Exceptions"]).array(),
  resolvedByUsers: z.string().array().nullable(),
  toDate: z.date(),
  triggerTypes: z.string().array().nullable(),
  volumeOfCases: z.number()
})

export type Audit = z.infer<typeof AuditSchema>
