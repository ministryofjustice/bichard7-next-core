import z from "zod"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"
import { CaseSchema } from "../Case"
import { NoteDtoSchema } from "../Note"

export const CaseForExceptionReportDtoSchema = CaseSchema.pick({
  asn: true,
  courtName: true,
  courtReference: true,
  courtRoom: true,
  defendantName: true,
  messageReceivedAt: true,
  notes: true,
  ptiurn: true
}).extend({
  hearingDate: dateLikeToDate,
  notes: z.array(NoteDtoSchema),
  resolvedAt: dateLikeToDate,
  resolver: z.string(),
  type: z.string()
})

export const ExceptionReportDtoSchema = z.object({
  cases: z.array(CaseForExceptionReportDtoSchema),
  username: z.string()
})

export type CaseForExceptionReportDto = z.infer<typeof CaseForExceptionReportDtoSchema>
export type ExceptionReportDto = z.infer<typeof ExceptionReportDtoSchema>
export type ExceptionReportType = "Exceptions" | "Triggers"
