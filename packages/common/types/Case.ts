import { unvalidatedHearingOutcomeSchema } from "@moj-bichard7/core/schemas/unvalidatedHearingOutcome"
import { z } from "zod"

export const CaseRowSchema = z.object({
  annotated_msg: z.string().describe("Annotated Hearing Outcome"),
  asn: z.string().max(21).nullable(),
  court_code: z.string().max(7).nullable(),
  court_date: z.date().nullable(),
  court_name: z.string().max(500).nullable(),
  court_name_upper: z.string().max(200).nullable(),
  court_reference: z.string().max(11),
  court_room: z.string().max(2),
  create_ts: z.date(),
  defendant_name: z.string().max(500).nullable(),
  defendant_name_upper: z.string().max(200).nullable(),
  error_count: z.number().describe("The number of Exceptions are on case"),
  error_id: z.number().describe("The primary key"),
  error_insert_ts: z.date().nullable(),
  error_locked_by_id: z.string().max(32).nullable(),
  error_quality_checked: z.number().nullable(),
  error_reason: z.string().max(350).nullable(),
  error_report: z.string().max(1000),
  error_resolved_by: z.string().max(32).nullable(),
  error_resolved_ts: z.date().nullable(),
  error_status: z.number().nullable(),
  is_urgent: z.number(),
  last_pnc_failure_resubmission_ts: z.date().nullable(),
  message_id: z.string(),
  msg_received_ts: z.date(),
  org_for_police_filter: z.string(),
  phase: z.number().gt(0).lte(3),
  pnc_update_enabled: z.string().nullable(),
  ptiurn: z.string().max(11).nullable(),
  resolution_ts: z.date().nullable(),
  total_pnc_failure_resubmissions: z.number().default(0),
  trigger_count: z.number(),
  trigger_insert_ts: z.date().nullable(),
  trigger_locked_by_id: z.string().nullable(),
  trigger_quality_checked: z.number().nullable(),
  trigger_reason: z.string().max(350).nullable(),
  trigger_resolved_by: z.string().max(32).nullable(),
  trigger_resolved_ts: z.date().nullable(),
  trigger_status: z.number().nullable(),
  updated_msg: z.string().nullable(),
  user_updated_flag: z.number()
})

export const CaseSchema = z.object({
  annotated_msg: z.string().describe("Annotated Hearing Outcome"),
  asn: z.string().max(21).nullable(),
  court_code: z.string().max(7).nullable(),
  court_date: z.date().nullable(),
  court_name: z.string().max(500).nullable(),
  court_reference: z.string().max(11),
  defendant_name: z.string().max(500).nullable(),
  error_id: z.number().describe("The primary key"),
  error_locked_by_fullname: z.string().nullable(),
  error_locked_by_id: z.string().max(32).nullable(),
  error_report: z.string().max(1000),
  error_status: z.number().nullable(),
  is_urgent: z.number(),
  org_for_police_filter: z.string(),
  phase: z.number().gt(0).lte(3),
  ptiurn: z.string().max(11).nullable(),
  resolution_ts: z.date().nullable(),
  trigger_count: z.number(),
  trigger_locked_by_fullname: z.string().nullable(),
  trigger_locked_by_id: z.string().nullable(),
  trigger_status: z.number().nullable(),
  updated_msg: z.string().nullable()
})

// TODO: Add notes
// TODO: Add triggers
export const PartialCaseDtoSchema = z.object({
  asn: z.string().nullable(),
  canUserEditExceptions: z.boolean().optional(),
  courtDate: z.date().nullable(),
  courtName: z.string().nullable(),
  defendantName: z.string().nullable(),
  errorId: z.number(),
  errorLockedByUserFullName: z.string().nullable().optional(),
  errorLockedByUsername: z.string().nullable(),
  errorReport: z.string().optional(),
  errorStatus: z.string().nullable(),
  isUrgent: z.number().optional(),
  ptiurn: z.string().nullable(),
  resolutionTimestamp: z.date().nullable(),
  triggerCount: z.number().optional(),
  triggerLockedByUserFullName: z.string().nullable().optional(),
  triggerLockedByUsername: z.string().nullable(),
  triggerStatus: z.string().nullable()
})

export const FullCaseDtoSchema = PartialCaseDtoSchema.and(
  z.object({
    aho: unvalidatedHearingOutcomeSchema,
    courtCode: z.string().nullable(),
    courtReference: z.string().optional(),
    orgForPoliceFilter: z.string().optional(),
    phase: z.number().optional(),
    updatedHearingOutcome: unvalidatedHearingOutcomeSchema.or(z.null())
  })
)

export type Case = z.infer<typeof CaseSchema>
export type CaseDto = z.infer<typeof FullCaseDtoSchema>
export type CasePartialDto = z.infer<typeof PartialCaseDtoSchema>
export type CaseRow = z.infer<typeof CaseRowSchema>
