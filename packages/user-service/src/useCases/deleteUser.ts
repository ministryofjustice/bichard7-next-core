import User from "types/User"
import Database from "types/Database"
import { isError } from "types/Result"
import AuditLogger from "types/AuditLogger"
import markUserAsDeleted from "./markUserAsDeleted"
import AuditLogEvent from "types/AuditLogEvent"

interface DeleteUserResult {
  serverSideError?: Error
  isDeleted?: boolean
}

export default async (
  db: Database,
  auditLogger: AuditLogger,
  user: Partial<User>,
  currentUser: Partial<User>
): Promise<DeleteUserResult> => {
  const markUserAsDeletedResult = await markUserAsDeleted(db, user.emailAddress as string, currentUser.id as number)

  if (isError(markUserAsDeletedResult)) {
    return { serverSideError: markUserAsDeletedResult }
  }

  await auditLogger.logEvent(AuditLogEvent.userDeleted, { user, by: currentUser })

  return { isDeleted: true }
}
