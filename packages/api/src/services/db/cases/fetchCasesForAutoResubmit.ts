import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import type { DatabaseConnection } from "../../../types/DatabaseGateway"

import { PNC_ERRORS } from "../../../useCases/cases/resubmit/hasPncConnectionException"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"

const MAX_RESUBMISSIONS = 100

export const fetchCasesForAutoResubmit = async (
  databaseConnection: DatabaseConnection,
  user: User
): PromiseResult<CaseRow[]> => {
  if (!user.groups.includes(UserGroup.Service)) {
    return new Error("Not a Service User")
  }

  const results = await databaseConnection.connection<CaseRow[]>`
    SELECT * 
    FROM br7own.error_list el
    WHERE 
      el.total_pnc_failure_resubmissions < ${MAX_RESUBMISSIONS} 
      AND el.error_locked_by_id IS NULL
      AND el.error_status = ${ResolutionStatusNumber.Unresolved}
      AND el.error_report ILIKE ANY (${PNC_ERRORS.map((e) => `%${e}%`)}) 
  `

  if (isError(results)) {
    return results
  }

  return results
}
