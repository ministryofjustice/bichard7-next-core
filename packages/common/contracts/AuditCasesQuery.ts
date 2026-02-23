import type { z } from "zod"

import { CaseOrderingQuerySchema } from "./CaseOrderingQuery"
import { PaginationQuerySchema } from "./PaginationQuery"

export const AuditCasesQuerySchema = PaginationQuerySchema.extend(CaseOrderingQuerySchema)

export type AuditCasesQuery = z.infer<typeof AuditCasesQuerySchema>
