import { unvalidatedHearingOutcomeSchema } from "@moj-bichard7/core/schemas/unvalidatedHearingOutcome"
import { z } from "zod"

import { CaseAge } from "./CaseAge"
import { NoteDtoSchema, NoteRowSchema, NoteSchema } from "./Note"
import { TriggerDtoSchema, TriggerRowSchema, TriggerSchema } from "./Trigger"

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
  notes: z.array(NoteRowSchema).optional(),
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
  triggers: z.array(TriggerRowSchema).optional(),
  updated_msg: z.string().nullable(),
  user_updated_flag: z.number()
})

export const CaseSchema = z.object({
  aho: z.string().describe("Annotated Hearing Outcome"),
  asn: z.string().max(21).nullable(),
  courtCode: z.string().max(7).nullable(),
  courtDate: z.date().nullable(),
  courtName: z.string().max(500).nullable(),
  courtNameUpper: z.string().max(200).nullable(),
  courtReference: z.string().max(11),
  courtRoom: z.string().max(2),
  createdAt: z.date(),
  defendantName: z.string().max(500).nullable(),
  defendantNameUpper: z.string().max(200).nullable(),
  errorCount: z.number().describe("The number of Exceptions are on case"),
  errorId: z.number().describe("The primary key"),
  errorInsertedAt: z.date().nullable(),
  errorLockedById: z.string().max(32).nullable(),
  errorQualityChecked: z.number().nullable(),
  errorReason: z.string().max(350).nullable(),
  errorReport: z.string().max(1000),
  errorResolvedAt: z.date().nullable(),
  errorResolvedBy: z.string().max(32).nullable(),
  errorStatus: z.number().nullable(),
  isUrgent: z.number(),
  lastPncFailureResubmissionAt: z.date().nullable(),
  messageId: z.string(),
  messageReceivedAt: z.date(),
  notes: z.array(NoteSchema).optional(),
  orgForPoliceFilter: z.array(z.number()).min(0),
  phase: z.number().gt(0).lte(3),
  pncUpdateEnabled: z.string().nullable(),
  ptiurn: z.string().max(11).nullable(),
  resolutionAt: z.date().nullable(),
  totalPncFailureResubmissions: z.number().default(0),
  triggerCount: z.number(),
  triggerInsertedAt: z.date().nullable(),
  triggerLockedById: z.string().nullable(),
  triggerQualityChecked: z.number().nullable(),
  triggerReason: z.string().max(350).nullable(),
  triggerResolvedAt: z.date().nullable(),
  triggerResolvedBy: z.string().max(32).nullable(),
  triggers: z.array(TriggerSchema).optional(),
  triggerStatus: z.number().nullable(),
  updatedAho: z.string().nullable(),
  userUpdatedFlag: z.number()
})

export const CaseIndexDtoSchema = z.object({
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
  noteCount: z.number().optional(),
  notes: z.array(NoteDtoSchema),
  ptiurn: z.string().nullable(),
  resolutionTimestamp: z.date().nullable(),
  triggerCount: z.number().optional(),
  triggerLockedByUserFullName: z.string().nullable().optional(),
  triggerLockedByUsername: z.string().nullable(),
  triggers: z.array(TriggerDtoSchema),
  triggerStatus: z.string().nullable()
})

export const CaseDtoSchema = CaseIndexDtoSchema.and(
  z.object({
    aho: unvalidatedHearingOutcomeSchema,
    courtCode: z.string().nullable(),
    courtReference: z.string().optional(),
    orgForPoliceFilter: z.string().optional(),
    phase: z.number().optional(),
    updatedHearingOutcome: unvalidatedHearingOutcomeSchema.or(z.null())
  })
)

export const CaseAgesSchema = z.object(
  Object.fromEntries(Object.values(CaseAge).map((key) => [key, z.coerce.number().min(0).optional()]))
)

export const CaseIndexMetadataSchema = z.object({
  caseAges: CaseAgesSchema,
  cases: z.array(CaseIndexDtoSchema),
  maxPerPage: z.number(),
  pageNum: z.number(),
  returnCases: z.number(),
  totalCases: z.number()
})

export type Case = z.infer<typeof CaseSchema>
export type CaseAges = z.infer<typeof CaseAgesSchema>
export type CaseDto = z.infer<typeof CaseDtoSchema>
export type CaseIndexDto = z.infer<typeof CaseIndexDtoSchema>
export type CaseIndexMetadata = z.infer<typeof CaseIndexMetadataSchema>
export type CaseRow = z.infer<typeof CaseRowSchema>
