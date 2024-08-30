import { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { EntityManager } from "typeorm"
import { isError } from "../../types/Result"
import { TriggerQualityCheckStatus } from "../../utils/triggerQualityCheckStatus"
import CourtCase from "../entities/CourtCase"
import Trigger from "../entities/Trigger"

const updateCourtCase = async (
  entityManager: EntityManager,
  courtCase: CourtCase,
  aho: AnnotatedHearingOutcome,
  hasAddedOrDeletedTriggers: boolean
): Promise<Pick<CourtCase, "orgForPoliceFilter"> | Error> => {
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
    triggerCount: triggers.length,
    asn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber.substring(0, asnSize),
    ptiurn: aho.AnnotatedHearingOutcome.HearingOutcome.Case.PTIURN.substring(0, ptiurnSize),
    orgForPoliceFilter
  }

  let triggerParameters: Partial<CourtCase> = {}
  if (hasAddedOrDeletedTriggers) {
    if (triggers.length === 0) {
      triggerParameters = {
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerReason: null,
        triggerStatus: null,
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerQualityChecked: null,
        triggerInsertedTimestamp: null
      }
    } else if (triggers.every((trigger) => trigger.status === "Resolved")) {
      triggerParameters = {
        ...(!courtCase.errorStatus || courtCase.errorStatus === "Resolved" ? { resolutionTimestamp: new Date() } : {}),
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerStatus: "Resolved",
        triggerResolvedBy: "System",
        triggerResolvedTimestamp: triggerTimestamp,
        triggerQualityChecked: TriggerQualityCheckStatus.Unchecked
      }
    } else if (triggers.some((trigger) => trigger.status === "Resolved")) {
      triggerParameters = {
        resolutionTimestamp: null,
        triggerReason: triggers.filter((trigger) => trigger.status === "Resolved")[0].triggerCode,
        triggerStatus: "Unresolved",
        triggerResolvedBy: null,
        triggerResolvedTimestamp: null,
        triggerQualityChecked: TriggerQualityCheckStatus.Unchecked,
        triggerInsertedTimestamp: triggerTimestamp
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
