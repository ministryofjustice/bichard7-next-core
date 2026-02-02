import { isAfter, isBefore } from "date-fns"
import z from "zod"

export const CreateAuditSchema = z
  .object({
    dateFrom: z.iso.date(),
    dateTo: z.iso.date(),
    includedTypes: z.enum(["Triggers", "Exceptions"]).array(),
    resolvedByUsers: z.string().array().optional(),
    triggerTypes: z.string().array().optional(),
    volumeOfCases: z.number().gte(1).lte(100)
  })
  .superRefine(({ dateFrom, dateTo }, ctx) => {
    if (isBefore(dateTo, dateFrom) || isAfter(dateTo, new Date())) {
      ctx.addIssue({
        code: "custom",
        input: {
          dateFrom,
          dateTo
        },
        message: "Date range cannot be in the future"
      })
    }
  })

export type CreateAudit = z.infer<typeof CreateAuditSchema>
