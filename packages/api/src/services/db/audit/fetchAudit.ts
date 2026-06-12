import type { User } from "@moj-bichard7/common/types/User"

import { type Audit, type AuditDto, AuditSchema } from "@moj-bichard7/common/types/Audit"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import z from "zod"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { convertAuditToDto } from "../../../useCases/dto/convertAuditToDto"

export const fetchAudit = async (
  database: DatabaseConnection,
  auditId: number,
  { username }: User
): PromiseResult<AuditDto | null> => {
  const sql = database.connection

  const results = await sql<Audit[]>`
      SELECT
        audit_id,
        created_by,
        created_when,
        completed_when,
        from_date,
        to_date,
        included_types,
        resolved_by_users,
        trigger_types,
        volume_of_cases
      FROM 
        br7own.audits
      WHERE
        audit_id = ${auditId}
        AND created_by = ${username}
    `.catch((error: Error) => error)

  if (isError(results)) {
    return new Error("Failed to get audit record")
  }

  if (results.length === 0) {
    return null
  }

  const parsedResults = z.array(AuditSchema).safeParse(results)
  if (!parsedResults.success) {
    return parsedResults.error
  }

  return convertAuditToDto(parsedResults.data[0])
}
