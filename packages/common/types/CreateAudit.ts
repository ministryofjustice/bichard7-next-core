import { isAfter, isBefore } from "date-fns"
import z from "zod"

export const CreateAuditSchema = z
  .object({
    dateFrom: z.date(),
    dateTo: z.date(),
    includedTypes: z.enum(["Triggers", "Exceptions"]).array(),
    resolvedByUsers: z.string().array().optional(),
    triggerTypes: z.string().array().optional(),
    volumeOfCases: z.number().gte(1).lte(100)
  })
  .refine(({ dateFrom, dateTo }) => {
    if (isBefore(dateTo, dateFrom) || isAfter(dateTo, new Date())) {
      return false
    }
  })

export type CreateAudit = z.infer<typeof CreateAuditSchema>
