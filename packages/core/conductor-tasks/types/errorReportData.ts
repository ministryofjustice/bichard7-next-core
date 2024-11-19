import { z } from "zod"

export const errorReportDataSchema = z.object({
  errorMessage: z.string(),
  externalId: z.string(),
  messageId: z.string(),
  ptiUrn: z.string(),
  receivedDate: z.string()
})

export type ErrorReportData = z.infer<typeof errorReportDataSchema>
