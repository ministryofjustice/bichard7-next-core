import { dateLikeToDate } from "@moj-bichard7/common/schemas/dateLikeToDate"
import { CodeDetailDtoSchema } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import { z } from "zod"

export const UserDetailJsonRowSchema = z.object({
  exceptions: CodeDetailDtoSchema.array(),
  report_date: dateLikeToDate,
  triggers: CodeDetailDtoSchema.array()
})

export type UserDetailJsonRow = z.infer<typeof UserDetailJsonRowSchema>
