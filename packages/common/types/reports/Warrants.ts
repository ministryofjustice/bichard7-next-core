import z from "zod"

export const CaseForWarrantsReportDtoSchema = z.object({
  asn: z.string(),
  bailOrNoBail: z.string(),
  courtName: z.string(),
  dateOfBirth: z.string(),
  dateTimeReceivedByCJSE: z.string(),
  defendantAddress: z.string(),
  defendantName: z.string(),
  gender: z.string(),
  hearingDate: z.string(),
  hearingTime: z.string(),
  nextCourtAppearance: z.string(),
  nextCourtAppearanceDate: z.string(),
  numberOfDaysTakenToEnterPortal: z.number().optional(),
  offencesTitle: z.string(),
  offencesWording: z.string(),
  pncId: z.string(),
  ptiurn: z.string(),
  triggerResolvedDate: z.string(),
  triggerStatus: z.string(),
  warrantText: z.string(),
  warrantType: z.string()
})

export type CaseForWarrantsReportDto = z.infer<typeof CaseForWarrantsReportDtoSchema>
