import type { CreateAudit } from "@moj-bichard7/common/contracts/CreateAudit"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { getPotentialCasesToAudit } from "../../services/db/audit/getPotentialCasesToAudit"
import { insertAudit } from "../../services/db/audit/insertAudit"
import { insertAuditCases } from "../../services/db/audit/insertAuditCases"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { getVolumeOfCasesToAudit } from "./getVolumeOfCasesToAudit"

export async function createAudit(
  database: WritableDatabaseConnection,
  createAudit: CreateAudit,
  user: User
): PromiseResult<AuditDto> {
  if (!userAccess(user)[Permission.CanAuditCases]) {
    return new NotAllowedError()
  }

  return await database
    .transaction<AuditDto | Error>(async (tx) => {
      const auditResult = await insertAudit(tx, createAudit, user)
      if (isError(auditResult)) {
        throw auditResult
      }

      const potentialCasesToAuditResult = await getPotentialCasesToAudit(tx, createAudit, user)
      if (isError(potentialCasesToAuditResult)) {
        throw potentialCasesToAuditResult
      }

      const caseIds = getVolumeOfCasesToAudit(potentialCasesToAuditResult, createAudit.volumeOfCases)
      const auditCasesResult = insertAuditCases(tx, auditResult.auditId, caseIds)
      if (isError(auditCasesResult)) {
        throw auditCasesResult
      }

      return auditResult
    })
    .catch((err) => err)
}
