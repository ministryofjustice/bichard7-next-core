import z from "zod"

export const AuditSchema = z.object({
  auditId: z.number(),
  completedWhen: z.date(),
  createdBy: z.string(),
  createdWhen: z.date(),
  dateFrom: z.date(),
  dateTo: z.date(),
  includedTypes: z.enum(["Triggers", "Exceptions"]).array(),
  resolvedByUsers: z.string().array().optional(),
  triggerTypes: z.string().array().optional(),
  volumeOfCases: z.number()
})

export type Audit = z.infer<typeof AuditSchema>
