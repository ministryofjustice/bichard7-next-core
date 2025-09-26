export default class AuditLogEvent {
  private constructor(
    public readonly code: string,
    public readonly description: string
  ) {}

  public static readonly loggedIn = new AuditLogEvent("user.logged-in", "User logged in")

  public static readonly passwordUpdated = new AuditLogEvent("user.password.updated", "Password updated")

  public static readonly passwordReset = new AuditLogEvent("user.password.reset", "Password reset")

  public static readonly userCreated = new AuditLogEvent("user.created", "User created")

  public static readonly userDetailsEdited = new AuditLogEvent("user.edited", "User details edited")

  public static readonly userDeleted = new AuditLogEvent("user.deleted", "User deleted")
}
