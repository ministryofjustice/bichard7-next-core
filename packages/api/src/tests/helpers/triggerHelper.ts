import type { Trigger } from "@moj-bichard7/common/types/Trigger"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ResolutionStatus, ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import { resolutionStatusCodeByText, resolutionStatusFromDb } from "../../useCases/dto/convertResolutionStatus"

export const createTriggers = async (
  postgres: End2EndPostgres,
  caseId: number,
  triggers: Partial<Trigger>[],
  username?: string
) => {
  await Promise.all(
    triggers.map(async (trigger, index) => {
      const triggerStatus = resolutionStatusFromDb(trigger.status ?? null)

      const triggerToInsert: Trigger = {
        createdAt: trigger.createdAt ?? new Date(),
        errorId: caseId,
        resolvedAt: triggerStatus === ResolutionStatus.Resolved ? (trigger.resolvedAt ?? new Date()) : null,
        resolvedBy: triggerStatus === ResolutionStatus.Resolved ? (username ?? "GeneralHandler") : null,
        status: trigger.status ?? ResolutionStatusNumber.Unresolved,
        triggerCode: trigger.triggerCode ?? TriggerCode.TRPR0001,
        triggerId: trigger.triggerId ?? index,
        triggerItemIdentity: trigger.triggerItemIdentity ?? null
      }

      await postgres.createTestTrigger(triggerToInsert)
    })
  )

  const triggerResolutionUser = triggers.map((t) => t.resolvedBy)[0] ?? "GeneralHandler"
  const allResolvedTriggers = triggers.filter(
    (t) => resolutionStatusFromDb(t.status ?? null) === ResolutionStatus.Resolved
  )
  const allTriggersResolved = allResolvedTriggers.length === triggers.length
  const triggerResolvedBy = allTriggersResolved ? (username ?? triggerResolutionUser) : null
  const validResolvedAtDates = triggers
    .map(({ resolvedAt }) => resolvedAt)
    .filter((resolvedAt): resolvedAt is Date => resolvedAt instanceof Date)
  const maxResolvedAtDate =
    validResolvedAtDates.length > 0 ? new Date(Math.max(...validResolvedAtDates.map((d) => d.getTime()))) : null
  const triggerResolvedAt = allTriggersResolved ? (maxResolvedAtDate ?? new Date()) : null

  const triggerStatus = triggerResolvedBy
    ? resolutionStatusCodeByText(ResolutionStatus.Resolved)
    : resolutionStatusCodeByText(ResolutionStatus.Unresolved)

  if (!triggerStatus) {
    throw new Error("Trigger Status is null/undefined")
  }

  await postgres.updateCaseWithTriggers(
    caseId,
    triggerResolvedBy,
    triggerResolvedAt,
    triggers.length,
    triggerStatus,
    triggers[triggers.length - 1].triggerCode ?? TriggerCode.TRPR0001
  )
}
