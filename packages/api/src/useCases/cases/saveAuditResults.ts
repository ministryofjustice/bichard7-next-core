import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { isError } from "@moj-bichard7/common/types/Result"

import type { AuditQuality } from "../../services/db/cases/auditCase"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import auditCase from "../../services/db/cases/auditCase"
import insertNote from "../../services/db/cases/insertNote"
import { UnprocessableEntityError } from "../../types/errors/UnprocessableEntityError"

const saveAuditResults = async (
  database: WritableDatabaseConnection,
  caseId: number,
  auditQuality: AuditQuality,
  userId: string,
  note: string
): PromiseResult<void> => {
  return database.transaction(async (transactionDb) => {
    const auditResultsSaved = await auditCase(transactionDb, caseId, auditQuality)
    if (isError(auditResultsSaved)) {
      throw auditResultsSaved
    }

    if (!auditResultsSaved) {
      throw new UnprocessableEntityError("Audit results could not be saved")
    }

    const errorListNote = `Trigger quality: ${auditQuality.triggerQuality}. Exception quality: ${auditQuality.errorQuality}. ${note}`
    const noteSaved = await insertNote(transactionDb, caseId, errorListNote, userId)
    if (isError(noteSaved)) {
      throw noteSaved
    }

    if (!noteSaved) {
      throw new UnprocessableEntityError("Audit note could not be saved")
    }

    return
  })
}

export default saveAuditResults
