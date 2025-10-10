import { v4 as uuid } from "uuid"
import type KeyValuePair from "./KeyValuePair"

export default class AuditLog {
  public readonly auditLogId: string

  public readonly timestamp: Date

  constructor(
    public readonly description: string,
    public readonly eventCode: string,
    public readonly username: string,
    public readonly userIp: string,
    public readonly requestUri: string,
    public readonly attributes?: KeyValuePair<string, unknown>
  ) {
    this.auditLogId = uuid()
    this.timestamp = new Date()
  }
}
