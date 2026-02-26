import z from "zod"

import { NoteDtoSchema, NoteRowSchema } from "./Note"

export const AuditCaseSchema = z.object({
  asn: z.string().max(21).nullable(),
  audit_case_id: z.number(),
  audit_id: z.number(),
  court_code: z.string().max(7).nullable(),
  court_date: z.date().nullable(),
  court_name: z.string().max(500).nullable(),
  defendant_name: z.string().max(500).nullable(),
  error_id: z.number().describe("The primary key"),
  error_quality_checked: z.number().nullable(),
  msg_received_ts: z.date(),
  notes: z.array(NoteRowSchema).optional(),
  ptiurn: z.string().max(11).nullable(),
  resolution_ts: z.date().nullable(),
  trigger_quality_checked: z.number().nullable(),
  trigger_status: z.number().nullable()
})

export const AuditCaseDtoSchema = z.object({
  asn: z.string().nullable(),
  courtDate: z.date().nullable(),
  courtName: z.string().nullable(),
  defendantName: z.string().nullable(),
  errorId: z.number(),
  errorQualityChecked: z.number().nullable(),
  messageReceivedTimestamp: z.date().nullable(),
  noteCount: z.number().optional(),
  notes: z.array(NoteDtoSchema),
  ptiurn: z.string().nullable(),
  resolutionTimestamp: z.date().nullable(),
  triggerQualityChecked: z.number().nullable(),
  triggerStatus: z.string().nullable()
})

export const AuditCasesMetadataSchema = z.object({
  cases: z.array(AuditCaseDtoSchema),
  maxPerPage: z.number(),
  pageNum: z.number(),
  returnCases: z.number(),
  totalCases: z.number()
})

export type AuditCase = z.infer<typeof AuditCaseSchema>
export type AuditCaseDto = z.infer<typeof AuditCaseDtoSchema>
export type AuditCasesMetadata = z.infer<typeof AuditCasesMetadataSchema>
