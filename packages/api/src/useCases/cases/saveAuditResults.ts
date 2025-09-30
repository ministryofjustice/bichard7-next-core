import type { PromiseResult } from "@moj-bichard7/common/types/Result"

import { exceptionQualityValues } from "@moj-bichard7/common/types/ExceptionQuality"
import { isError } from "@moj-bichard7/common/types/Result"
import { triggerQualityValues } from "@moj-bichard7/common/types/TriggerQuality"

import type { AuditQuality } from "../../services/db/cases/auditCase"
import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import auditCase from "../../services/db/cases/auditCase"
import insertNote from "../../services/db/cases/insertNote"
import { NotFoundError } from "../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../types/errors/UnprocessableEntityError"

const formatNote = (triggerQuality?: number, errorQuality?: number, note?: string): string => {
  const triggerQualityChecked = triggerQualityValues[(triggerQuality ?? 1) as keyof typeof triggerQualityValues]
  const errorQualityChecked = exceptionQualityValues[(errorQuality ?? 1) as keyof typeof exceptionQualityValues]

  return `Trigger quality: ${triggerQualityChecked}. Exception quality: ${errorQualityChecked}. ${note ?? ""}`
}

const saveAuditResults = async (
  database: WritableDatabaseConnection,
  caseId: number,
  auditQuality: AuditQuality,
  userId: string,
  note: string | undefined
): PromiseResult<void> => {
  try {
    return await database.transaction(async (transactionDb) => {
      const auditResultsSaved = await auditCase(transactionDb, caseId, auditQuality)

      if (isError(auditResultsSaved)) {
        throw auditResultsSaved
      }

      if (!auditResultsSaved) {
        throw new UnprocessableEntityError("Audit results could not be saved")
      }

      const errorListNote = formatNote(auditQuality.triggerQuality, auditQuality.errorQuality, note)
      const noteSaved = await insertNote(transactionDb, caseId, errorListNote, userId)

      if (isError(noteSaved)) {
        throw noteSaved
      }

      if (!noteSaved) {
        throw new UnprocessableEntityError("Audit note could not be saved")
      }

      return
    })
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof UnprocessableEntityError) {
      return err
    }

    return Error((err as Error).message)
  }
}

export default saveAuditResults
