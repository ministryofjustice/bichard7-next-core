import type { DataSource, EntityManager, SelectQueryBuilder } from "typeorm"
import { Brackets, MoreThan } from "typeorm"
import type CourtCase from "../entities/CourtCase"
import type User from "../entities/User"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import Permission from "@moj-bichard7/common/types/Permission"
import Trigger from "../entities/Trigger"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"

export const filterByUserAccess = (
  dataSource: DataSource | EntityManager,
  query: SelectQueryBuilder<CourtCase>,
  user: User
): SelectQueryBuilder<CourtCase> => {
  if (userAccess(user)[Permission.ListAllCases]) {
    return query
  }

  const triggerHandlerFilter = new Brackets((qb) => {
    const triggers = dataSource
      .getRepository(Trigger)
      .createQueryBuilder("T1")
      .select("COUNT(*)")
      .where("T1.error_id = courtCase.error_id")
      .andWhere("T1.trigger_code NOT IN (:...excludedTriggers)")

    qb.where(`(${triggers.getQuery()}) > 0`).andWhere(
      new Brackets((orQb) => {
        orQb
          .orWhere({ triggerStatus: "Unresolved" })
          .orWhere({ triggerResolvedBy: user.username })
          .orWhere("trigger.resolvedBy = :username", { username: user.username })
      })
    )
  })

  const exceptionHandlerFilter = new Brackets((qb) => {
    qb.andWhere({ errorCount: MoreThan(0) }).andWhere(
      new Brackets((orQb) => {
        orQb
          .orWhere("courtCase.errorStatus IN (:...status)", {
            status: [ResolutionStatusNumber.Unresolved, ResolutionStatusNumber.Submitted]
          })
          .orWhere({ errorResolvedBy: user.username })
      })
    )
  })

  const canAccessTriggers = userAccess(user)[Permission.Triggers]
  const canAccessExceptions = userAccess(user)[Permission.Exceptions]

  if (canAccessTriggers && canAccessExceptions) {
    query.andWhere(
      new Brackets((qb) => {
        qb.orWhere(triggerHandlerFilter).orWhere(exceptionHandlerFilter)
      })
    )
  } else if (canAccessTriggers) {
    query.andWhere(triggerHandlerFilter)
  } else if (canAccessExceptions) {
    query.andWhere(exceptionHandlerFilter)
  } else {
    query.andWhere("FALSE")
  }

  return query
}
