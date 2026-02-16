import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"
import type { Audit, AuditDto } from "@moj-bichard7/common/types/Audit"
import type { User } from "@moj-bichard7/common/types/User"

import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { convertAuditToDto } from "../../../useCases/dto/convertAuditToDto"

export const insertAudit = async (
  database: WritableDatabaseConnection,
  { fromDate, includedTypes, resolvedByUsers, toDate, triggerTypes, volumeOfCases }: CreateAuditInput,
  { username }: User
): PromiseResult<AuditDto> => {
  const sql = database.connection

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
        ${username},
        CURRENT_DATE,
        ${fromDate},
        ${toDate},
        ${includedTypes},
        ${resolvedByUsers},
        ${triggerTypes ?? null},
        ${volumeOfCases}
      )
      RETURNING *
    `.catch((error: Error) => error)
  if (isError(results)) {
    return new Error("Failed to create audit record")
  }

  return convertAuditToDto(results[0])
}
