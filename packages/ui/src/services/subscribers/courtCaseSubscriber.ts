import { EntitySubscriberInterface, EventSubscriber } from "typeorm"
import { formatUserFullName } from "../../utils/formatUserFullName"
import CourtCase from "../entities/CourtCase"

@EventSubscriber()
export class CourtCaseSubscriber implements EntitySubscriberInterface<CourtCase> {
  listenTo() {
    return CourtCase
  }

  async afterLoad(courtCase: CourtCase) {
    const errorLockedByUser = courtCase.errorLockedByUser
    const triggerLockedByUser = courtCase.triggerLockedByUser

    if (errorLockedByUser) {
      courtCase.errorLockedByUserFullName = formatUserFullName(errorLockedByUser.forenames, errorLockedByUser.surname)
    }

    if (triggerLockedByUser) {
      courtCase.triggerLockedByUserFullName = formatUserFullName(
        triggerLockedByUser.forenames,
        triggerLockedByUser.surname
      )
    }
  }
}
