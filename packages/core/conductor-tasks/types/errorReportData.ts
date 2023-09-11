import { z } from "zod"

export const errorReportDataSchema = z.object({
  receivedDate: z.string(),
  messageId: z.string(),
  externalId: z.string(),
  ptiUrn: z.string()
})

export type ErrorReportData = z.infer<typeof errorReportDataSchema>
