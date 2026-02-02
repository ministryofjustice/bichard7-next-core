import type { AuditDto, AuditRow } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { convertAuditToDto } from "../../../useCases/dto/convertAuditToDto"

export default async (database: WritableDatabaseConnection, createAudit: CreateAudit): PromiseResult<AuditDto> => {
  return await database.transaction<AuditDto | Error>(async (tx) => {
    const sql = tx.connection

    const results = await sql<AuditRow[]>`
      INSERT INTO br7own.audits (
        created_by,
        created_when,
        from_date,
        to_date,
        included_types,
        resolved_by_users,
        trigger_types,
        volume_of_cases)
      VALUES (
        'user',
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

    return convertAuditToDto(results[0])
  })
}
