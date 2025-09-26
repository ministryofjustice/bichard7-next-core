import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditQuality } from "../../services/db/cases/auditCase"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import auditCase from "../../services/db/cases/auditCase"
import { UnprocessableEntityError } from "../../types/errors/UnprocessableEntityError"

const saveAuditResults = async (
  database: WritableDatabaseConnection,
  caseId: number,
  auditQuality: AuditQuality
): PromiseResult<void> => {
  const auditResultsSaved = await auditCase(database, caseId, auditQuality)

  if (isError(auditResultsSaved)) {
    return auditResultsSaved
  }

  if (!auditResultsSaved) {
    return new UnprocessableEntityError("Audit results could not be saved")
  }

  return
}

export default saveAuditResults
