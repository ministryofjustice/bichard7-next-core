import z from "zod"

export const CommunitySentenceReportDtoSchema = z.object({
  arrestDate: z.string(),
  chargeDate: z.string(),
  custodialSentenceDurationMonths: z.string().optional(),
  dateOfBirth: z.string(),
  dateOfSentence: z.string(),
  defendantName: z.string().nullish(),
  domesticViolenceFlag: z.string(),
  errorId: z.number(),
  expiryOfSentence: z.string(),
  homeAddress: z.string(),
  offenceAddress: z.string(),
  offenceStartDate: z.string(),
  offenceTitle: z.string(),
  plea: z.string().optional(),
  pncId: z.string(),
  receivedDate: z.string(),
  resultCode: z.number(),
  suspendedSentenceDurationMonths: z.string().optional()
})

export type CommunitySentenceReportDto = z.infer<typeof CommunitySentenceReportDtoSchema>
