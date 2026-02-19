import z from "zod"

import { dateLikeToDate } from "../../schemas/dateLikeToDate"
import { CaseRowSchema } from "../Case"
import { TriggerRowSchema } from "../Trigger"
import { dateRangeShape, validateDateRange } from "./BaseQuery"

export const WarrantsReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

export const CaseRowForWarrantsReportSchema = CaseRowSchema.pick({
  annotated_msg: true,
  asn: true,
  court_name: true,
  defendant_name: true,
  error_id: true,
  msg_received_ts: true,
  ptiurn: true
}).extend({
  court_date: dateLikeToDate,
  triggers: z.array(TriggerRowSchema)
})

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
export type CaseRowForWarrantsReport = z.infer<typeof CaseRowForWarrantsReportSchema>
export type WarrantsReportQuery = z.infer<typeof WarrantsReportQuerySchema>
