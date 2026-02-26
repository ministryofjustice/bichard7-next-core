import { z } from "zod"

import { CaseOrderingQuerySchema } from "./CaseOrderingQuery"
import { PaginationQuerySchema } from "./PaginationQuery"

export const AuditCasesQuerySchema = z.object({
  ...PaginationQuerySchema.shape,
  ...CaseOrderingQuerySchema.shape
})

export type AuditCasesQuery = z.infer<typeof AuditCasesQuerySchema>
