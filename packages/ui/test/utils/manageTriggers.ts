import type TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import type { ResolutionStatus } from "types/ResolutionStatus"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"
import deleteFromEntity from "./deleteFromEntity"

type TestTrigger = {
  triggerId: number
  triggerCode: TriggerCode
  status: ResolutionStatus
  triggerItemIdentity?: number
  createdAt: Date
  resolvedBy?: string
  resolvedAt?: Date
}

const insertTriggers = async (caseId: number, triggers: TestTrigger[], username?: string): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(Trigger)
    .values(
      triggers.map((t) => ({
        resolvedAt: t.status === "Resolved" ? new Date() : null,
        resolvedBy: t.status === "Resolved" ? (username ?? "GeneralHandler") : null,
        errorId: caseId,
        ...t
      }))
    )
    .execute()

  const triggerResolutionUser = triggers.map((t) => t.resolvedBy)[0] ?? "GeneralHandler"
  const allResolvedTriggers = triggers.filter((t) => t.status === "Resolved")
  const allTriggersResolved = allResolvedTriggers.length === triggers.length
  const triggerResolvedBy = allTriggersResolved ? (username ?? triggerResolutionUser) : null

  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      triggerResolvedBy,
      triggerCount: () => `trigger_count + ${triggers.length}`,
      triggerStatus: triggerResolvedBy ? "Resolved" : "Unresolved",
      triggerReason: triggers[triggers.length - 1].triggerCode
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  return true
}

const deleteTriggers = async () => deleteFromEntity(Trigger)

export { deleteTriggers, insertTriggers }
export type { TestTrigger }
