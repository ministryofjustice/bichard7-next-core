import z from "zod"

import { CaseRowSchema } from "../Case"
import { TriggerRowSchema } from "../Trigger"
import { dateRangeShape, validateDateRange } from "./BaseQuery"

export const WarrantsReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export const CaseRowForWarrantsReportSchema = CaseRowSchema.pick({
  annotated_msg: true,
  asn: true,
  court_date: true,
  court_name: true,
  defendant_name: true,
  error_id: true,
  msg_received_ts: true,
  ptiurn: true
}).extend({
  triggers: z.array(TriggerRowSchema)
})

export const CaseForWarrantsReportSchema = z.object({
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
  offencesTitle: z.string(),
  offencesWording: z.string(),
  pncId: z.string(),
  ptiurn: z.string(),
  warrantText: z.string(),
  warrantType: z.string()
})

export type CaseForWarrantsReport = z.infer<typeof CaseForWarrantsReportSchema>
export type CaseRowForWarrantsReport = z.infer<typeof CaseRowForWarrantsReportSchema>
export type WarrantsReportQuery = z.infer<typeof WarrantsReportQuerySchema>
