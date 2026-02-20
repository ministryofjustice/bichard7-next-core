import z from "zod"

import { dateRangeShape, validateDateRange } from "../types/reports/BaseQuery"

export const DomesticViolenceReportQuerySchema = z.object(dateRangeShape).superRefine(validateDateRange)

const DOMESTIC_VIOLENCE_REPORT_TYPES = ["Domestic Violence", "Vulnerable Victim"] as const
export const DomesticViolenceReportTypeSchema = z.enum(DOMESTIC_VIOLENCE_REPORT_TYPES)

export const CaseForDomesticViolenceReportDtoSchema = z.object({
  asn: z.string(),
  courtName: z.string(),
  dateOfBirth: z.string(),
  defendantName: z.string(),
  hearingDate: z.string(),
  offenceTitle: z.string(),
  outcome: z.string(),
  ptiurn: z.string(),
  type: DomesticViolenceReportTypeSchema
})

export type CaseForDomesticViolenceReportDto = z.infer<typeof CaseForDomesticViolenceReportDtoSchema>
export type DomesticViolenceReportQuery = z.infer<typeof DomesticViolenceReportQuerySchema>
export type DomesticViolenceReportType = z.infer<typeof DomesticViolenceReportTypeSchema>
