import { z } from "zod"

export const CaseDBSchema = z.object({
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

// TODO: Fill in missing attributes
// TODO: Add notes
// TODO: Add triggers
export const PartialCaseDTOSchema = z.object({
  asn: z.string().nullable(),
  canUserEditExceptions: z.string().optional(),
  courtDate: z.date().nullable(),
  courtName: z.string().nullable(),
  defendantName: z.string().nullable(),
  errorId: z.number(),
  errorLockedByUserFullName: z.string().optional(),
  errorLockedByUsername: z.string().nullable(),
  errorReport: z.string().optional(),
  errorStatus: z.number().nullable(),
  isUrgent: z.number().optional(),
  ptiurn: z.string().nullable(),
  resolutionTimestamp: z.date().nullable(),
  triggerCount: z.number().optional(),
  triggerLockedByUserFullName: z.string().optional(),
  triggerLockedByUsername: z.string().nullable(),
  triggerStatus: z.number().nullable()
})

// TODO: Fill in missing attributes
export const FullCaseDTOSchema = PartialCaseDTOSchema.and(
  z.object({
    aho: z.string(),
    courtCode: z.string().nullable(),
    courtReference: z.string().optional(),
    orgForPoliceFilter: z.string().optional(),
    phase: z.number().optional(),
    updatedHearingOutcome: z.string().nullable()
  })
)

export type CaseDB = z.infer<typeof CaseDBSchema>
export type CaseDTO = z.infer<typeof FullCaseDTOSchema>
export type CasePartialDTO = z.infer<typeof PartialCaseDTOSchema>
