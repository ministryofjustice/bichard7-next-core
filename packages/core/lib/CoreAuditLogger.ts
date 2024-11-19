import type { AuditLogEvent, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import type EventCode from "@moj-bichard7/common/types/EventCode"
import type AuditLogger from "../types/AuditLogger"
import getAuditLogEvent from "./getAuditLogEvent"

export default class CoreAuditLogger implements AuditLogger {
  private events: AuditLogEvent[] = []

  constructor(private source: AuditLogEventSource) {}

  log = (code: EventCode, category: EventCategory, attributes: Record<string, unknown> = {}) => {
    const event = getAuditLogEvent(code, category, this.source, attributes)
    this.events.push(event)
  }

  debug = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.debug, attributes)
  }

  info = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.information, attributes)
  }

  error = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.error, attributes)
  }

  warn = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.warning, attributes)
  }

  getEvents = (): AuditLogEvent[] => this.events
}
