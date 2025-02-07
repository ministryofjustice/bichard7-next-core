import AuditLogStatus from "@moj-bichard7/common/types/AuditLogStatus"
import EventCode from "@moj-bichard7/common/types/EventCode"

import type { ApiAuditLogEvent } from "../../../../types/AuditLogEvent"

import PncStatus from "../../../../types/PncStatus"
import TriggerStatus from "../../../../types/TriggerStatus"
import CalculateMessageStatusUseCase from "./CalculateMessageStatusUseCase"

let eventIndex = 0
const createEvent = (eventCode: EventCode, category = "information", attributes?: Record<string, string>) =>
  ({
    attributes,
    category,
    eventCode,
    timestamp: new Date(new Date().getTime() + 1000 * eventIndex++)
  }) as unknown as ApiAuditLogEvent
const sanitisedEvent = () => createEvent(EventCode.Sanitised)
const archivedRecordEvent = () => createEvent(EventCode.ErrorRecordArchived)
const errorEvent = () => createEvent(EventCode.MessageRejected, "error")
const exceptionsEvent = () => createEvent(EventCode.ExceptionsGenerated)
const retryingEvent = () => createEvent(EventCode.RetryingMessage)
const pncUpdatedEvent = () => createEvent(EventCode.PncUpdated)
const recordIgnoredNoRecordableOffencesEvent = () => createEvent(EventCode.IgnoredNonrecordable)
const recordIgnoredNoOffencesEvent = () => createEvent(EventCode.IgnoredNoOffences)
const prePNCUpdateTriggersGeneratedEvent = () =>
  createEvent(EventCode.TriggersGenerated, "information", {
    "Trigger 1 Details": "TRPR0004",
    "Trigger 2 Details": "TRPR0004",
    "Trigger 3 Details": "TRPR0006"
  })
const postPNCUpdateTriggersGeneratedEvent = () =>
  createEvent(EventCode.TriggersGenerated, "information", { "Trigger 1 Details": "TRPS0003" })
const allTriggersResolvedEvent = () => createEvent(EventCode.AllTriggersResolved, "information")
const triggerInstancesResolvedEvent = () =>
  createEvent(EventCode.TriggersResolved, "information", {
    "Trigger 1 Details": "TRPR0004 (1)",
    "Trigger 2 Details": "TRPR0004 (2)",
    "Trigger 3 Details": "TRPR0006",
    "Trigger 4 Details": "TRPS0003"
  })
const triggerInstancesPartiallyResolvedEvent = () =>
  createEvent(EventCode.TriggersResolved, "information", {
    "Trigger 1 Details": "TRPR0004 (1)",
    "Trigger 2 Details": "TRPR0004 (2)"
  })
const exceptionsManuallyResolvedEvent = () => createEvent(EventCode.ExceptionsResolved)

describe("CalculateMessageStatusUseCase", () => {
  describe("overall message status", () => {
    it("should not affect the status calculation when message has sanitised event", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        errorEvent(),
        sanitisedEvent(),
        archivedRecordEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Error)
      expect(pncStatus).toBe(PncStatus.Processing)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should not affect the status calculation when message has error record archival event", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        errorEvent(),
        archivedRecordEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Error)
      expect(pncStatus).toBe(PncStatus.Processing)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when there are no exceptions and triggers, and PNC is updated", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        pncUpdatedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Updated)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when there are no exceptions and triggers, and record is ignored (no offences)", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        recordIgnoredNoOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when there are no exceptions and triggers, and record is ignored (no recordable offences)", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when there are no exceptions, triggers are resolved, and PNC is updated", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent(),
        pncUpdatedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Updated)
      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should return Completed status when there are no exceptions, triggers are resolved, and record is ignored", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent(),
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should return Completed status when exceptions are resolved and resubmitted, there are no triggers, and record is ignored", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when there are no exceptions, all triggers resolved event exists, and PNC is updated", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        allTriggersResolvedEvent(),
        pncUpdatedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Updated)
      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should return Completed status when exceptions are resolved and resubmitted, there are no triggers, and PNC is updated", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        pncUpdatedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Updated)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when exceptions are manually resolved, there are no triggers, and record is ignored", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        exceptionsManuallyResolvedEvent(),
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when exceptions are manually resolved, there are no triggers, and PNC is updated", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        exceptionsManuallyResolvedEvent(),
        pncUpdatedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Updated)
      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should return Completed status when exceptions are resolved and resubmitted, triggers are resolved, and record is ignored", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent(),
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should return Completed status when exceptions are resolved and resubmitted, triggers are resolved, and PNC is updated", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent(),
        pncUpdatedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Updated)
      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should return Completed status when exceptions are manually resolved, triggers are resolved, and record is ignored", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        exceptionsManuallyResolvedEvent(),
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent(),
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should return Completed status when exceptions are manually resolved, triggers are resolved, and PNC is updated", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        exceptionsManuallyResolvedEvent(),
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent(),
        pncUpdatedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Completed)
      expect(pncStatus).toBe(PncStatus.Updated)
      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should return Retrying status when last event type is retrying", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        errorEvent(),
        retryingEvent(),
        errorEvent(),
        retryingEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Retrying)
      expect(pncStatus).toBe(PncStatus.Processing)
      expect(triggerStatus).toBe(TriggerStatus.Generated)
    })

    it("should return Error status when there is an event with category Error", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        errorEvent(),
        retryingEvent(),
        errorEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Error)
      expect(pncStatus).toBe(PncStatus.Processing)
      expect(triggerStatus).toBe(TriggerStatus.Generated)
    })

    it("should return Processing status when triggers are not resolved", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Processing)
      expect(pncStatus).toBe(PncStatus.Processing)
      expect(triggerStatus).toBe(TriggerStatus.Generated)
    })

    it("should return Processing status when triggers are partially resolved", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesPartiallyResolvedEvent(),
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Processing)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.Generated)
    })

    it("should return Processing status when exceptions are not resolved", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent(),
        recordIgnoredNoRecordableOffencesEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Processing)
      expect(pncStatus).toBe(PncStatus.Ignored)
      expect(triggerStatus).toBe(TriggerStatus.Generated)
    })

    it("should return Processing status when there are no PNC updated or record ignored events", () => {
      const { pncStatus, status, triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent()
      ).call()

      expect(status).toBe(AuditLogStatus.Processing)
      expect(pncStatus).toBe(PncStatus.Processing)
      expect(triggerStatus).toBe(TriggerStatus.Generated)
    })
  })

  describe("PNC status", () => {
    it("should default to Processing", () => {
      const { pncStatus } = new CalculateMessageStatusUseCase(undefined).call()

      expect(pncStatus).toBe(PncStatus.Processing)
    })

    it("should be Updated if the PNC has been updated", () => {
      const { pncStatus } = new CalculateMessageStatusUseCase(undefined, pncUpdatedEvent()).call()

      expect(pncStatus).toBe(PncStatus.Updated)
    })

    it.each([
      EventCode.IgnoredAncillary,
      EventCode.IgnoredDisabled,
      EventCode.IgnoredAppeal,
      EventCode.IgnoredAppeal,
      EventCode.IgnoredNoOffences,
      EventCode.IgnoredNonrecordable
    ])("should be Ignored if the message is ignored (%s)", (eventCode: EventCode) => {
      const { pncStatus } = new CalculateMessageStatusUseCase(undefined, createEvent(eventCode)).call()

      expect(pncStatus).toBe(PncStatus.Ignored)
    })

    it("should be ManuallyResolved if the exception was manually resolved", () => {
      const { pncStatus } = new CalculateMessageStatusUseCase(undefined, exceptionsManuallyResolvedEvent()).call()

      expect(pncStatus).toBe(PncStatus.ManuallyResolved)
    })

    it("should be Exceptions if there were exceptions generated", () => {
      const { pncStatus } = new CalculateMessageStatusUseCase(undefined, exceptionsEvent()).call()

      expect(pncStatus).toBe(PncStatus.Exceptions)
    })
  })

  describe("Trigger status", () => {
    it("should default to NoTriggers", () => {
      const { triggerStatus } = new CalculateMessageStatusUseCase(undefined).call()

      expect(triggerStatus).toBe(TriggerStatus.NoTriggers)
    })

    it("should be Resolved if triggers were raised and resolved", () => {
      const { triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent(),
        triggerInstancesResolvedEvent()
      ).call()

      expect(triggerStatus).toBe(TriggerStatus.Resolved)
    })

    it("should be Generated if triggers were raised and not resolved", () => {
      const { triggerStatus } = new CalculateMessageStatusUseCase(
        undefined,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent()
      ).call()

      expect(triggerStatus).toBe(TriggerStatus.Generated)
    })

    it("should set all statuses to Duplicate when audit log status is already Duplicate", () => {
      const result = new CalculateMessageStatusUseCase(
        AuditLogStatus.Duplicate,
        prePNCUpdateTriggersGeneratedEvent(),
        postPNCUpdateTriggersGeneratedEvent()
      ).call()

      expect(result).toEqual({
        pncStatus: PncStatus.Duplicate,
        status: AuditLogStatus.Duplicate,
        triggerStatus: TriggerStatus.Duplicate
      })
    })
  })
})
