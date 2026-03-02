import z from "zod"

import { CaseSchema } from "../Case"

export const CaseForExceptionReportDtoSchema = CaseSchema.pick({
  asn: true,
  courtName: true,
  courtReference: true,
  courtRoom: true,
  defendantName: true,
  ptiurn: true
}).extend({
  hearingDate: z.string(),
  messageReceivedAt: z.string(),
  notes: z.string(),
  resolutionAction: z.string(),
  resolvedAt: z.string(),
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
