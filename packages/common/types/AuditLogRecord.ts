import type { z } from "zod"
import type { auditLogApiRecordInputSchema, auditLogApiRecordOutputSchema } from "../schemas/auditLogRecord"

export type AuditLogApiRecordInput = z.infer<typeof auditLogApiRecordInputSchema>

export type AuditLogApiRecordOutput = z.infer<typeof auditLogApiRecordOutputSchema>
