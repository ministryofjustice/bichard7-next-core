import z from "zod"

export const CaseForBailsReportDtoSchema = z.object({
  asn: z.string(),
  automatedToPNC: z.string(),
  bailConditions: z.string(),
  courtName: z.string().nullish(),
  dateOfBirth: z.string(),
  daysToEnterPortal: z.number().nullish(),
  defendantAddress: z.string(),
  defendantName: z.string().nullish(),
  hearingDate: z.string(),
  hearingTime: z.string(),
  nextAppearanceCourt: z.string(),
  nextAppearanceDate: z.string(),
  nextAppearanceTime: z.string(),
  offenceTitles: z.string(),
  ptiurn: z.string(),
  receivedDate: z.string(),
  triggerResolvedDate: z.string().nullish(),
  triggerStatus: z.string()
})

export type CaseForBailsReportDto = z.infer<typeof CaseForBailsReportDtoSchema>
