import type { Trigger } from "@moj-bichard7/common/types/Trigger"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import {
  ResolutionStatus,
  resolutionStatusCodeByText,
  resolutionStatusFromDb
} from "../../useCases/dto/convertResolutionStatus"

export const createTriggers = async (
  postgres: End2EndPostgres,
  caseId: number,
  triggers: Trigger[],
  username?: string
) => {
  Promise.all(
    triggers.map(async (trigger) => {
      const triggerStatus = resolutionStatusFromDb(trigger.status)

      const triggerToInsert: Partial<Trigger> = {
        create_ts: trigger.create_ts,
        error_id: caseId,
        resolved_by: triggerStatus === ResolutionStatus.Resolved ? (username ?? "GeneralHandler") : null,
        resolved_ts: triggerStatus === ResolutionStatus.Resolved ? new Date() : null,
        status: trigger.status,
        trigger_code: trigger.trigger_code
      }

      await postgres.createTestTrigger(triggerToInsert)
    })
  )

  const triggerResolutionUser = triggers.map((t) => t.resolved_by)[0] ?? "GeneralHandler"
  const allResolvedTriggers = triggers.filter((t) => resolutionStatusFromDb(t.status) === ResolutionStatus.Resolved)
  const allTriggersResolved = allResolvedTriggers.length === triggers.length
  const triggerResolvedBy = allTriggersResolved ? (username ?? triggerResolutionUser) : null

  const triggerStatus = triggerResolvedBy
    ? resolutionStatusCodeByText(ResolutionStatus.Resolved)
    : resolutionStatusCodeByText(ResolutionStatus.Unresolved)

  if (!triggerStatus) {
    throw new Error("Trigger Status is null/undefined")
  }

  await postgres.updateCaseWithTriggers(
    caseId,
    triggerResolvedBy,
    triggers.length,
    triggerStatus,
    triggers[triggers.length - 1].trigger_code
  )
}
