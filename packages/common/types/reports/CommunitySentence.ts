import z from "zod"

export const CommunitySentenceReportDtoSchema = z.object({
  custodialSentenceDurationMonths: z.string().optional(),
  dateOfBirth: z.string(),
  dateOfSentence: z.string(),
  defendantName: z.string().nullish(),
  domesticViolenceFlag: z.string(),
  expiryOfSentence: z.string(),
  offenceTitle: z.string(),
  pncId: z.string(),
  receivedDate: z.string(),
  suspendedSentenceDurationMonths: z.string().optional()
})

export type CommunitySentenceReportDto = z.infer<typeof CommunitySentenceReportDtoSchema>
