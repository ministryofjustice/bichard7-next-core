import z from "zod"

export const CommunitySentenceReportDtoSchema = z.object({
  custodialSentenceDuration: z.string().optional(),
  dateOfBirth: z.string(),
  dateOfSentence: z.string(),
  defendantName: z.string().nullish(),
  domesticViolenceFlag: z.boolean(),
  expiryOfSentence: z.string(),
  offenceTitle: z.string(),
  pncId: z.string(),
  receivedDate: z.string(),
  suspendedSentenceDuration: z.string().optional()
})

export type CommunitySentenceReportDto = z.infer<typeof CommunitySentenceReportDtoSchema>
