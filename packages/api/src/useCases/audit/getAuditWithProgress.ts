import type { AuditWithProgressDto } from "@moj-bichard7/common/types/Audit"
import type { User } from "@moj-bichard7/common/types/User"

import Permission from "@moj-bichard7/common/types/Permission"
import { isError, type PromiseResult } from "@moj-bichard7/common/types/Result"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { WritableDatabaseConnection } from "../../types/DatabaseGateway"

import { fetchAuditWithProgress } from "../../services/db/audit/fetchAuditWithProgress"
import { NotAllowedError } from "../../types/errors/NotAllowedError"
import { NotFoundError } from "../../types/errors/NotFoundError"
import { convertAuditWithProgressToDto } from "../dto/convertAuditToDto"

export async function getAuditWithProgress(
  database: WritableDatabaseConnection,
  auditId: number,
  user: User
): PromiseResult<AuditWithProgressDto> {
  if (!userAccess(user)[Permission.CanAuditCases]) {
    return new NotAllowedError()
  }

  return await database
    .transaction<AuditWithProgressDto | Error>(async (tx) => {
      const audit = await fetchAuditWithProgress(tx, auditId, user)
      if (isError(audit)) {
        throw audit
      }

      if (!audit) {
        throw new NotFoundError()
      }

      return convertAuditWithProgressToDto(audit)
    })
    .catch((err) => err)
}
