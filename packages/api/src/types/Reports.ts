import z from "zod"

export const ExceptionsReportDataSchema = z.object({
  asn: z.string(),
  caseReference: z.string(),
  courtName: z.string(),
  courtroom: z.string(),
  dateTimeReceived: z.string(),
  dateTimeResolved: z.string(),
  defendantName: z.string(),
  hearingDate: z.string(),
  notes: z.string(),
  ptiurn: z.string(),
  resolutionAction: z.string(),
  type: z.string()
})

export type ExceptionsReportData = z.infer<typeof ExceptionsReportDataSchema>
