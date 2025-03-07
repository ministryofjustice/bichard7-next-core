import type { AuditLogEvent } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import getAuditLogEvent from "@moj-bichard7/core/lib/auditLog/getAuditLogEvent"
import type { Trigger } from "@moj-bichard7/core/types/Trigger"
import type { EntityManager } from "typeorm"
import { IsNull } from "typeorm"
import { AUDIT_LOG_EVENT_SOURCE } from "../../config"
import { isError } from "../../types/Result"
import type CourtCase from "../entities/CourtCase"
import { default as TriggerEntity } from "../entities/Trigger"
import type User from "../entities/User"

const getTriggersDetails = (triggers: Trigger[]) =>
  triggers.reduce((acc: Record<string, unknown>, trigger, index) => {
    acc[`Trigger ${index + 1} Details`] = trigger.code
    return acc
  }, {})

const generateEvent = (eventCode: EventCode, triggers: Trigger[], user: User, hasUnresolvedException: boolean) =>
  getAuditLogEvent(eventCode, EventCategory.information, AUDIT_LOG_EVENT_SOURCE, {
    user: user.username,
    auditLogVersion: 2,
    "Trigger and Exception Flag": hasUnresolvedException,
    "Number of Triggers": triggers.length,
    ...getTriggersDetails(triggers)
  })

const updateTriggers = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  triggersToAdd: Trigger[],
  triggersToDelete: Trigger[],
  hasUnresolvedException: boolean,
  user: User,
  events: AuditLogEvent[]
): Promise<Error | void> => {
  const generatedEvents: AuditLogEvent[] = []

  if (triggersToAdd.length > 0) {
    const addTriggersResult = await entityManager
      .getRepository(TriggerEntity)
      .insert(
        triggersToAdd.map((triggerToAdd) => ({
          triggerCode: triggerToAdd.code,
          triggerItemIdentity: triggerToAdd.offenceSequenceNumber,
          status: "Unresolved",
          createdAt: new Date(),
          errorId: courtCase.errorId
        }))
      )
      .catch((error) => error)

    if (isError(addTriggersResult)) {
      return addTriggersResult
    }

    generatedEvents.push(generateEvent(EventCode.TriggersGenerated, triggersToAdd, user, hasUnresolvedException))
  }

  if (triggersToDelete.length > 0) {
    const deleteTriggersResult = await Promise.all(
      triggersToDelete.map((triggerToDelete) =>
        entityManager.getRepository(TriggerEntity).delete({
          errorId: courtCase.errorId,
          triggerCode: triggerToDelete.code,
          status: "Unresolved",
          triggerItemIdentity: triggerToDelete.offenceSequenceNumber ?? IsNull()
        })
      )
    ).catch((error) => error)

    if (isError(deleteTriggersResult)) {
      return deleteTriggersResult
    }

    generatedEvents.push(generateEvent(EventCode.TriggersDeleted, triggersToDelete, user, hasUnresolvedException))
  }

  generatedEvents.forEach((event) => events.push(event))
}

export default updateTriggers
