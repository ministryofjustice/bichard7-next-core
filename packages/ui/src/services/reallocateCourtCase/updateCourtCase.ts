import type { AnnotatedHearingOutcome } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { EntityManager } from "typeorm"

import { isError } from "../../types/Result"
import { TriggerQualityCheckStatus } from "../../utils/triggerQualityCheckStatus"
import CourtCase from "../entities/CourtCase"
import Trigger from "../entities/Trigger"

const updateCourtCase = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  aho: AnnotatedHearingOutcome,
  hasAddedOrDeletedTriggers: boolean
): Promise<Error | Pick<CourtCase, "orgForPoliceFilter">> => {
  const triggerTimestamp = new Date()
  const triggers = await entityManager
    .getRepository(Trigger)
    .findBy({ errorId: courtCase.errorId })
    .catch((error: Error) => error)

  if (isError(triggers)) {
    throw triggers
  }

  const asnSize = 21
  const ptiurnSize = 11
  const { SecondLevelCode, ThirdLevelCode } = aho.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner ?? {}
  const orgForPoliceFilter = `${SecondLevelCode}${ThirdLevelCode !== "00" ? ThirdLevelCode : ""}`
  const updateParameters: Partial<CourtCase> = {
    asn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber.substring(0, asnSize),
    orgForPoliceFilter,
    ptiurn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN.substring(0, ptiurnSize),
    triggerCount: triggers.length
  }

  let triggerParameters: Partial<CourtCase> = {}
  if (hasAddedOrDeletedTriggers) {
    if (triggers.length === 0) {
      triggerParameters = {
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerInsertedTimestamp: null,
        triggerQualityChecked: null,
        triggerReason: null,
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerStatus: null
      }
    } else if (triggers.every((trigger) => trigger.status === "Resolved")) {
      triggerParameters = {
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerQualityChecked: TriggerQualityCheckStatus.Unchecked,
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerResolvedBy: "System",
        triggerResolvedTimestamp: triggerTimestamp,
        triggerStatus: "Resolved"
      }
    } else if (triggers.some((trigger) => trigger.status === "Resolved")) {
      triggerParameters = {
        resolutionTimestamp: null,
        triggerInsertedTimestamp: triggerTimestamp,
        triggerQualityChecked: TriggerQualityCheckStatus.Unchecked,
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerStatus: "Unresolved"
      }
    }
  }

  const updateResult = await entityManager
    .createQueryBuilder()
    .update<CourtCase>(CourtCase)
    .set({ ...updateParameters, ...triggerParameters })
    .where({ errorId: courtCase.errorId })
    .execute()
    .catch((error: Error) => error)

  if (isError(updateResult)) {
    return updateResult
  }

  if (!updateResult.affected || updateResult.affected === 0) {
    return Error("Couldn't update the court case")
  }

  return { orgForPoliceFilter }
}

export default updateCourtCase
