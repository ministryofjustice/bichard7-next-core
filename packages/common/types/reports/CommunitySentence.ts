import z from "zod"

export const CommunitySentenceReportDtoSchema = z.object({
  caseRef: z.string(),
  dateOfBirth: z.string(),
  dateOfSentence: z.string(),
  defendantName: z.string().nullish(),
  domesticViolenceFlag: z.boolean(),
  expiryOfSentence: z.string(),
  offenceType: z.string(),
  pncId: z.string(),
  receivedDate: z.string(),
  suspendedSentenceOrderDuration: z.number()
})

export type CommunitySentenceReportDto = z.infer<typeof CommunitySentenceReportDtoSchema>
