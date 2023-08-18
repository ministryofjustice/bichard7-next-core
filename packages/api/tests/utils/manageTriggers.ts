import type { ResolutionStatus } from "../../src/types/ResolutionStatus"
import CourtCase from "../../src/services/entities/CourtCase"
import Trigger from "../../src/services/entities/Trigger"
import getDataSource from "../../src/services/getDataSource"

type TestTrigger = {
  triggerId: number
  triggerCode: string
  status: ResolutionStatus
  createdAt: Date
  resolvedBy?: string
  resolvedAt?: Date
}

const insertTriggers = async (caseId: number, triggers: TestTrigger[]): Promise<boolean> => {
  const dataSource = await getDataSource()

  await dataSource
    .createQueryBuilder()
    .insert()
    .into(Trigger)
    .values(
      triggers.map((t) => {
        return { ...t, errorId: caseId }
      })
    )
    .execute()

  await dataSource
    .createQueryBuilder()
    .update(CourtCase)
    .set({
      triggerCount: () => "trigger_count + 1",
      triggerReason: triggers[triggers.length - 1].triggerCode
    })
    .where("errorId = :id", { id: caseId })
    .execute()

  return true
}

export type { TestTrigger }
export { insertTriggers }
