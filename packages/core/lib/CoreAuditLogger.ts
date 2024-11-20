import type { AuditLogEvent, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import type EventCode from "@moj-bichard7/common/types/EventCode"

import EventCategory from "@moj-bichard7/common/types/EventCategory"

import type AuditLogger from "../types/AuditLogger"

import getAuditLogEvent from "./getAuditLogEvent"

export default class CoreAuditLogger implements AuditLogger {
  private events: AuditLogEvent[] = []

  debug = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.debug, attributes)
  }

  error = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.error, attributes)
  }

  getEvents = (): AuditLogEvent[] => this.events

  info = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.information, attributes)
  }

  log = (code: EventCode, category: EventCategory, attributes: Record<string, unknown> = {}) => {
    const event = getAuditLogEvent(code, category, this.source, attributes)
    this.events.push(event)
  }

  warn = (code: EventCode, attributes: Record<string, unknown> = {}) => {
    this.log(code, EventCategory.warning, attributes)
  }

  constructor(private source: AuditLogEventSource) {}
}
