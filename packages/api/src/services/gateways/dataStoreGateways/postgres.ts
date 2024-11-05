import type { User } from "@moj-bichard7/common/types/User"
import postgresFactory from "../../db/postgresFactory"
import type DataStoreGateway from "../interfaces/dataStoreGateway"
import caseCanBeResubmitted from "./postgres/canCaseBeResubmitted"
import fetchUserByUsername from "./postgres/fetchUserByUsername"

/*
 * We don't seem to have any logic for updating the AHO in core. It is all in the UI
 *
 * TODO: Check user's feature flags
 * TODO: UI `courtCase.canResolveOrSubmit(user)` only permission Exceptions so do we care about triggers?
 * TODO: Check the User doesn't have excluded trigger codes
 * TODO: Check what permission the user has (triggers or exceptions) and add lock
 * TODO: If case needs to be locked add AuditLogEvent
 *       Should be handled by court-cases/:caseId/index
 * TODO: amend the court case
 *       Shouldn't auto save done this?
 *       The UI creates a force owner and edits the aho if one doesn't exist
 *       Applies amendments to the aho
 *       Only updates if Phase 1
 *       Inserts notes
 *       Returns updated AHO
 */
class Postgres implements DataStoreGateway {
  protected readonly db = postgresFactory()

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.db, username)
  }

  async canCaseBeResubmitted(username: string, caseId: number, forceIds: number[]): Promise<boolean> {
    return await caseCanBeResubmitted(this.db, username, caseId, forceIds)
  }
}

export default Postgres
