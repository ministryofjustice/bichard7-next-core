import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { getPotentialCasesToAudit } from "../../services/db/audit/getPotentialCasesToAudit"
import { insertAudit } from "../../services/db/audit/insertAudit"

export async function createAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit,
  user: User
): PromiseResult<AuditDto> {
  return await database.transaction<AuditDto | Error>(async (tx) => {
    const auditResult = await insertAudit(tx, createAudit, user)
    if (isError(auditResult)) {
      throw auditResult
    }

    const potentialCasesToAudit = await getPotentialCasesToAudit(tx, createAudit, user)
    if (isError(potentialCasesToAudit)) {
      throw potentialCasesToAudit
    }

    return auditResult
  })
}
