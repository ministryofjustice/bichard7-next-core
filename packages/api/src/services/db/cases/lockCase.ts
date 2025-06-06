import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { User } from "@moj-bichard7/common/types/User"

import type { WritableDatabaseConnection } from "../../../types/DatabaseGateway"

import { LockReason } from "../../../types/LockReason"
import lockException from "./lockException"
import lockTrigger from "./lockTrigger"

const lockCase = async (
  database: WritableDatabaseConnection,
  user: User,
  caseId: number,
  lockReason: LockReason
): PromiseResult<boolean> =>
  lockReason === LockReason.Exception ? lockException(database, user, caseId) : lockTrigger(database, user, caseId)

export default lockCase
