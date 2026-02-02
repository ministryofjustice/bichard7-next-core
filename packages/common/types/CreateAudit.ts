import { isAfter, isBefore } from "date-fns"
import z from "zod"

export const CreateAuditSchema = z
  .object({
    fromDate: z.iso.date(),
    includedTypes: z.enum(["Triggers", "Exceptions"]).array(),
    resolvedByUsers: z.string().array().optional(),
    toDate: z.iso.date(),
    triggerTypes: z.string().array().optional(),
    volumeOfCases: z.number().gte(1).lte(100)
  })
  .superRefine(({ fromDate, toDate }, ctx) => {
    if (isBefore(toDate, fromDate) || isAfter(toDate, new Date())) {
      ctx.addIssue({
        code: "custom",
        input: {
          fromDate,
          toDate
        },
        message: "Date range cannot be in the future"
      })
    }
  })

export type CreateAudit = z.infer<typeof CreateAuditSchema>
