import z from "zod"

export const AuditSchema = z.object({
  audit_id: z.number(),
  completed_when: z.date().nullable(),
  created_by: z.string(),
  created_when: z.date(),
  from_date: z.date(),
  included_types: z.enum(["Triggers", "Exceptions"]).array().nonempty(),
  resolved_by_users: z.string().array().nonempty(),
  to_date: z.date(),
  trigger_types: z.string().array().nullable(),
  volume_of_cases: z.number()
})

export const AuditDtoSchema = z.object({
  auditId: z.number(),
  completedWhen: z.string().nullable(),
  createdBy: z.string(),
  createdWhen: z.string(),
  fromDate: z.string(),
  includedTypes: z.enum(["Triggers", "Exceptions"]).array().nonempty(),
  resolvedByUsers: z.string().array().nonempty(),
  toDate: z.string(),
  triggerTypes: z.string().array().nullable(),
  volumeOfCases: z.number()
})

export const AuditWithProgressSchema = z.object({
  ...AuditSchema.shape,
  audited_cases: z.number(),
  total_cases: z.number()
})

export const AuditWithProgressDtoSchema = z.object({
  ...AuditDtoSchema.shape,
  auditedCases: z.number(),
  totalCases: z.number()
})

export type Audit = z.infer<typeof AuditSchema>
export type AuditDto = z.infer<typeof AuditDtoSchema>
export type AuditWithProgress = z.infer<typeof AuditWithProgressSchema>
export type AuditWithProgressDto = z.infer<typeof AuditWithProgressDtoSchema>
