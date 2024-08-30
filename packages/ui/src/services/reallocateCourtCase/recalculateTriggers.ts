import { Trigger } from "@moj-bichard7-developers/bichard7-next-core/core/types/Trigger"
import { OUT_OF_AREA_TRIGGER_CODE, REALLOCATE_CASE_TRIGGER_CODE } from "../../config"
import { TriggersOutcome } from "../../types/TriggersOutcome"
import { default as TriggerEntity } from "../entities/Trigger"
import { isEmpty } from "lodash"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

type PartialTriggerEntity = Pick<TriggerEntity, "triggerCode" | "triggerItemIdentity" | "status">

const reallocateCaseTrigger = { code: REALLOCATE_CASE_TRIGGER_CODE } as Trigger
const outOfAreaCaseTrigger = { code: OUT_OF_AREA_TRIGGER_CODE } as Trigger

const containsTrigger = (triggers: Trigger[], trigger?: Trigger): boolean => {
  if (!trigger) {
    return false
  }
  return triggers.some((t) => t.code === trigger.code && t.offenceSequenceNumber === trigger.offenceSequenceNumber)
}

const asTrigger = (triggerEntity: PartialTriggerEntity): Trigger => {
  return {
    code: triggerEntity.triggerCode,
    offenceSequenceNumber: triggerEntity.triggerItemIdentity
  } as Trigger
}

const asTriggerEntity = (trigger: Trigger): PartialTriggerEntity => {
  return {
    triggerCode: trigger.code,
    triggerItemIdentity: trigger.offenceSequenceNumber,
    status: "Unresolved"
  }
}

const sameTriggers = (existingTriggers: TriggerEntity[], triggers: Trigger[]): boolean => {
  if (existingTriggers.length !== triggers.length) {
    return false
  }

  return triggers.every((trigger) =>
    existingTriggers.find(
      (existingTrigger) =>
        existingTrigger.triggerCode === trigger.code &&
        existingTrigger.triggerItemIdentity === trigger.offenceSequenceNumber &&
        existingTrigger.status !== "Resolved"
    )
  )
}

const removeTrigger = (triggers: Trigger[], code: TriggerCode) => {
  return triggers.filter((trigger) => trigger.code !== code)
}

const hasUnresolvedTrigger = (triggers: TriggerEntity[], code: TriggerCode) =>
  triggers.some((trigger) => trigger.triggerCode === code && trigger.status === "Unresolved")

const updateOutOfAreaTriggers = (triggersOutcome: TriggersOutcome, existingTriggers: TriggerEntity[]) => {
  const hasNewOutOfAreaAndReallocateTriggers =
    containsTrigger(triggersOutcome.triggersToAdd, reallocateCaseTrigger) &&
    containsTrigger(triggersOutcome.triggersToAdd, outOfAreaCaseTrigger)

  const hasUnresolvedReallocateTriggerAndNewOutOfAreaTrigger =
    hasUnresolvedTrigger(existingTriggers, REALLOCATE_CASE_TRIGGER_CODE) &&
    containsTrigger(triggersOutcome.triggersToAdd, outOfAreaCaseTrigger)

  if (hasNewOutOfAreaAndReallocateTriggers || hasUnresolvedReallocateTriggerAndNewOutOfAreaTrigger) {
    triggersOutcome.triggersToAdd = removeTrigger(triggersOutcome.triggersToAdd, OUT_OF_AREA_TRIGGER_CODE)
  }

  if (
    hasUnresolvedTrigger(existingTriggers, OUT_OF_AREA_TRIGGER_CODE) &&
    containsTrigger(triggersOutcome.triggersToAdd, reallocateCaseTrigger) &&
    !containsTrigger(triggersOutcome.triggersToDelete, outOfAreaCaseTrigger)
  ) {
    triggersOutcome.triggersToDelete.push(outOfAreaCaseTrigger)
  }
}

const updateReallocateTriggers = (triggersOutcome: TriggersOutcome, existingTriggers: TriggerEntity[]) => {
  const sumOfTriggers = triggersOutcome.triggersToAdd
    .map((triggerToAdd) => asTriggerEntity(triggerToAdd))
    .concat(existingTriggers)
    .filter((trigger) => !containsTrigger(triggersOutcome.triggersToDelete, asTrigger(trigger)))

  const existingReallocateTriggerIsResolved =
    sumOfTriggers.length === 1 &&
    sumOfTriggers.some(
      (trigger) => trigger.triggerCode === REALLOCATE_CASE_TRIGGER_CODE && trigger.status === "Resolved"
    )
  const unresolvedTriggers = sumOfTriggers.filter((trigger) => trigger.status === "Unresolved")

  if (existingReallocateTriggerIsResolved) {
    triggersOutcome.triggersToAdd.push(reallocateCaseTrigger)
  } else if (
    (sumOfTriggers.length > 1 &&
      hasUnresolvedTrigger(existingTriggers, REALLOCATE_CASE_TRIGGER_CODE) &&
      containsTrigger(triggersOutcome.triggersToAdd, reallocateCaseTrigger)) ||
    (unresolvedTriggers.length > 1 && containsTrigger(triggersOutcome.triggersToAdd, reallocateCaseTrigger))
  ) {
    triggersOutcome.triggersToAdd = removeTrigger(triggersOutcome.triggersToAdd, REALLOCATE_CASE_TRIGGER_CODE)
  }

  if (isEmpty(unresolvedTriggers) && containsTrigger(triggersOutcome.triggersToDelete, reallocateCaseTrigger)) {
    triggersOutcome.triggersToDelete = removeTrigger(triggersOutcome.triggersToDelete, REALLOCATE_CASE_TRIGGER_CODE)
  } else if (
    unresolvedTriggers.length > 1 &&
    hasUnresolvedTrigger(existingTriggers, REALLOCATE_CASE_TRIGGER_CODE) &&
    !containsTrigger(triggersOutcome.triggersToDelete, reallocateCaseTrigger)
  ) {
    triggersOutcome.triggersToDelete.push(reallocateCaseTrigger)
  }
}

const recalculateTriggers = (existingTriggers: TriggerEntity[], triggers: Trigger[]): TriggersOutcome => {
  if (sameTriggers(existingTriggers, triggers)) {
    return { triggersToAdd: [], triggersToDelete: [] }
  }

  const existingUnresolvedTriggers = existingTriggers.filter(
    (existingTrigger) => existingTrigger.status === "Unresolved"
  )

  const hasExistingResolvedOutOfAreaTrigger = existingTriggers.some(
    (existingTrigger) =>
      existingTrigger.status === "Resolved" && existingTrigger.triggerCode === OUT_OF_AREA_TRIGGER_CODE
  )
  const hasExistingUnresolvedOutOfAreaTrigger = existingUnresolvedTriggers.find(
    (trigger) => trigger.triggerCode === OUT_OF_AREA_TRIGGER_CODE
  )

  const existingTriggersDetails = existingTriggers.map((existingTrigger) => asTrigger(existingTrigger))
  const newTriggersThatAreNotOnTheCase = triggers.filter(
    (newTrigger) => isEmpty(existingTriggers) || !containsTrigger(existingTriggersDetails, newTrigger)
  )

  const newOutOfAreaTriggers = triggers.filter(
    (newTrigger) =>
      newTrigger.code === OUT_OF_AREA_TRIGGER_CODE &&
      hasExistingResolvedOutOfAreaTrigger &&
      !hasExistingUnresolvedOutOfAreaTrigger
  )

  const existingUnresolvedTriggerNotInNewTriggersList = existingUnresolvedTriggers
    .filter((unresolvedTrigger) => !containsTrigger(triggers, asTrigger(unresolvedTrigger)))
    .map((triggerEntity) => ({
      code: triggerEntity.triggerCode,
      offenceSequenceNumber: triggerEntity.triggerItemIdentity
    })) as Trigger[]

  const triggersOutcome: TriggersOutcome = {
    triggersToAdd: newTriggersThatAreNotOnTheCase.concat(newOutOfAreaTriggers),
    triggersToDelete: existingUnresolvedTriggerNotInNewTriggersList
  }

  updateOutOfAreaTriggers(triggersOutcome, existingTriggers)
  updateReallocateTriggers(triggersOutcome, existingTriggers)

  return triggersOutcome
}

export default recalculateTriggers
