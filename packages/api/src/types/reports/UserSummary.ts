import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import z from "zod"

export const UserSummaryRowSchema = z.object({
  exceptions_resolved: z.number(),
  full_name: z.string(),
  report_date: dateLikeToDate,
  total_locked: z.number(),
  triggers_resolved: z.number(),
  user_id: z.number(),
  username: z.string()
})

export type UserSummaryRow = z.infer<typeof UserSummaryRowSchema>
