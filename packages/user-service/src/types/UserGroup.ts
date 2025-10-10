type UserGroup =
  | "B7Allocator"
  | "B7Audit"
  | "B7ExceptionHandler"
  | "B7GeneralHandler"
  | "B7Supervisor"
  | "B7TriggerHandler"
  | "B7UserManager"
  | "B7AuditLoggingManager"
  | "B7SuperUserManager"
  | "B7NewUI"

export type UserGroupResult = {
  id: string
  name: UserGroup
  friendly_name: string
}

export default UserGroup
