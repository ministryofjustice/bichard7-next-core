import type { Audit, AuditDto } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"
import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { convertAuditToDto } from "../../../useCases/dto/convertAuditToDto"
import { getCasesToAudit } from "./getCasesToAudit"

export const createAudit = async (
  database: WritableDatabaseConnection,
  createAudit: CreateAudit,
  user: User
): PromiseResult<AuditDto> => {
  return await database.transaction<AuditDto | Error>(async (tx) => {
    const sql = tx.connection

    const results = await sql<Audit[]>`
      INSERT INTO br7own.audits (
        created_by,
        created_when,
        from_date,
        to_date,
        included_types,
        resolved_by_users,
        trigger_types,
        volume_of_cases
      )
      VALUES (
        ${user.username},
        CURRENT_DATE,
        ${createAudit.fromDate},
        ${createAudit.toDate},
        ${createAudit.includedTypes},
        ${createAudit.resolvedByUsers ?? null},
        ${createAudit.triggerTypes ?? null},
        ${createAudit.volumeOfCases}
      )
      RETURNING *
    `.catch((error: Error) => error)
    if (isError(results)) {
      return new Error("Failed to create audit record")
    }

    const audit = results[0]
    const casesToAudit = await getCasesToAudit(tx, createAudit, user)

    return convertAuditToDto(audit)
  })
}
