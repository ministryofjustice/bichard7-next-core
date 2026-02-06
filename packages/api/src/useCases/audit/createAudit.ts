import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { insertAudit } from "../../services/db/audit/insertAudit"

export async function createAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit,
  user: User
): PromiseResult<AuditDto> {
  const auditResult = await insertAudit(database, createAudit, user)

  return auditResult
}
