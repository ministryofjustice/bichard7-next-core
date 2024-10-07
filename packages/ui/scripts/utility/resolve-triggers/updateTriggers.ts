import Trigger from "../../../src/services/entities/Trigger"
import { DataSource, EntityManager, In, IsNull } from "typeorm"
import { isError } from "../../../src/types/Result"

export default async function updateTriggers(
  dataSource: DataSource | EntityManager,
  courtCaseId: number,
  triggerIdsToResolve: number[],
  resolverUsername: string
) {
  const updateTriggerResult = await dataSource
    .getRepository(Trigger)
    .update(
      {
        triggerId: In(triggerIdsToResolve),
        resolvedAt: IsNull(),
        resolvedBy: IsNull()
      },
      {
        resolvedAt: new Date(),
        resolvedBy: resolverUsername,
        status: "Resolved"
      }
    )
    .catch((error: Error) => error)

  if (isError(updateTriggerResult)) {
    throw updateTriggerResult
  }

  if (!updateTriggerResult.affected) {
    throw Error(`Coudn't update triggers for court case ID ${courtCaseId}`)
  } else if (updateTriggerResult.affected > triggerIdsToResolve.length) {
    throw Error(
      `${triggerIdsToResolve.length} triggers was supposed to be updated but ${updateTriggerResult.affected} rows updated`
    )
  }
}
