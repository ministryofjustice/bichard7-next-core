import type { ApiAuditLogEvent } from "../../../../types/AuditLogEvent"

import AuditLogStatus from "../../../../types/AuditLogStatus"
import EventCode from "../../../../types/EventCode"
import PncStatus from "../../../../types/PncStatus"
import TriggerStatus from "../../../../types/TriggerStatus"

export type MessageStatus = {
  pncStatus: PncStatus
  status: AuditLogStatus
  triggerStatus: TriggerStatus
}

export default class CalculateMessageStatusUseCase {
  private readonly events: ApiAuditLogEvent[] = []

  private get exceptionsAreManuallyResolved(): boolean {
    return this.hasEventCode(EventCode.ExceptionsResolved)
  }

  private get hasErrorEvent(): boolean {
    const errorEvent = this.events.filter((event) => event.category === "error").slice(-1)[0]
    const retryingEvent = this.events.filter((event) => event.eventCode === EventCode.RetryingMessage).slice(-1)[0]
    const otherEvent = this.events
      .filter(
        (event) =>
          event.eventCode === EventCode.PncUpdated ||
          event.eventCode === EventCode.ExceptionsGenerated ||
          event.eventCode === EventCode.IgnoredNonrecordable ||
          event.eventCode === EventCode.TriggersResolved ||
          event.eventCode === EventCode.TriggersGenerated
      )
      .slice(-1)[0]

    return (
      errorEvent &&
      (!retryingEvent || errorEvent.timestamp > retryingEvent.timestamp) &&
      (!otherEvent || errorEvent.timestamp > otherEvent.timestamp) &&
      (errorEvent.eventCode !== EventCode.MessageRejected || !this.pncIsUpdated)
    )
  }

  private get hasExceptions(): boolean {
    return this.hasEventCode(EventCode.ExceptionsGenerated)
  }

  private get hasTriggers(): boolean {
    return this.hasEventCode(EventCode.TriggersGenerated)
  }

  private get isRetrying(): boolean {
    return this.events[this.events.length - 1]?.eventCode === EventCode.RetryingMessage
  }

  private get pncIsUpdated(): boolean {
    return this.hasEventCode(EventCode.PncUpdated)
  }

  private get pncStatus(): PncStatus {
    if (this.pncIsUpdated) {
      return PncStatus.Updated
    } else if (this.recordIsIgnored) {
      return PncStatus.Ignored
    } else if (this.exceptionsAreManuallyResolved) {
      return PncStatus.ManuallyResolved
    } else if (this.hasExceptions) {
      return PncStatus.Exceptions
    }

    return PncStatus.Processing
  }

  private get recordIsIgnored(): boolean {
    return (
      this.hasEventCode(EventCode.IgnoredAncillary) ||
      this.hasEventCode(EventCode.IgnoredDisabled) ||
      this.hasEventCode(EventCode.IgnoredAppeal) ||
      this.hasEventCode(EventCode.IgnoredReopened) ||
      this.hasEventCode(EventCode.IgnoredNoOffences) ||
      this.hasEventCode(EventCode.IgnoredNonrecordable)
    )
  }

  private get status(): AuditLogStatus {
    if (
      (!this.hasTriggers || this.triggersAreResolved) &&
      (this.exceptionsAreManuallyResolved || this.pncIsUpdated || this.recordIsIgnored)
    ) {
      return AuditLogStatus.completed
    } else if (this.isRetrying) {
      return AuditLogStatus.retrying
    } else if (this.hasErrorEvent) {
      return AuditLogStatus.error
    }

    return AuditLogStatus.processing
  }

  private get triggersAreResolved(): boolean {
    if (this.events.some((event) => event.eventCode === EventCode.AllTriggersResolved)) {
      return true
    }

    const triggersGeneratedEvents = this.events.filter((event) => event.eventCode === EventCode.TriggersGenerated)
    if (triggersGeneratedEvents.length === 0) {
      return false
    }

    const triggerResolvedEvents = this.events.filter((event) => event.eventCode === EventCode.TriggersResolved)
    if (!triggerResolvedEvents) {
      return false
    }

    const generatedTriggers = triggersGeneratedEvents.flatMap((event) =>
      Object.keys(event.attributes ?? {})
        .filter((key) => /Trigger \d+ Details/i.test(key))
        .map((key) => String(event.attributes?.[key]))
    )

    const resolvedTriggers = triggerResolvedEvents.flatMap((event) =>
      Object.keys(event.attributes ?? {})
        .filter((key) => /Trigger \d+ Details.*/i.test(key))
        .map((key) => String(event.attributes?.[key]).match(/(TRP[RS]\d{4})/)?.[1])
        .filter((value) => value)
    )

    return (
      generatedTriggers.length === resolvedTriggers.length &&
      !generatedTriggers.some((generatedTrigger) => !resolvedTriggers.includes(generatedTrigger))
    )
  }

  private get triggerStatus(): TriggerStatus {
    if (this.triggersAreResolved) {
      return TriggerStatus.Resolved
    } else if (this.hasTriggers) {
      return TriggerStatus.Generated
    }

    return TriggerStatus.NoTriggers
  }

  constructor(
    private currentAuditLogStatus: AuditLogStatus | undefined,
    ...allEvents: (ApiAuditLogEvent | ApiAuditLogEvent[])[]
  ) {
    this.events = allEvents
      .flatMap((events: ApiAuditLogEvent | ApiAuditLogEvent[]) => (Array.isArray(events) ? events : [events]))
      .sort((eventA, eventB) => (eventA.timestamp > eventB.timestamp ? 1 : -1))
  }

  call(): MessageStatus {
    if (this.currentAuditLogStatus === AuditLogStatus.duplicate) {
      return {
        pncStatus: PncStatus.Duplicate,
        status: AuditLogStatus.duplicate,
        triggerStatus: TriggerStatus.Duplicate
      }
    }

    return { pncStatus: this.pncStatus, status: this.status, triggerStatus: this.triggerStatus }
  }

  private hasEventCode(eventCode: EventCode): boolean {
    return !!this.events.find((event) => event.eventCode === eventCode)
  }
}
