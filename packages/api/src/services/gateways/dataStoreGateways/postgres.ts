import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import type { CaseDataForDto, CaseDataForIndexDto, CaseMessageId, Pagination } from "../../../types/Case"
import type DataStoreGateway from "../interfaces/dataStoreGateway"

import { LockReason } from "../../../types/LockReason"
import postgresFactory from "../../db/postgresFactory"
import caseCanBeResubmitted from "./postgres/cases/canCaseBeResubmitted"
import fetchCase from "./postgres/cases/fetchCase"
import fetchCases from "./postgres/cases/fetchCases"
import fetchNotes from "./postgres/cases/fetchNotes"
import fetchTriggers from "./postgres/cases/fetchTriggers"
import lockException from "./postgres/cases/lockException"
import lockTrigger from "./postgres/cases/lockTrigger"
import selectMessageId from "./postgres/cases/selectMessageId"
import { transaction } from "./postgres/transaction"
import fetchUserByUsername from "./postgres/users/fetchUserByUsername"

class Postgres implements DataStoreGateway {
  forceIds: number[] = []
  protected readonly postgres = postgresFactory()

  async canCaseBeResubmitted(username: string, caseId: number): Promise<boolean> {
    return await caseCanBeResubmitted(this.postgres, username, caseId, this.forceIds)
  }

  async fetchCase(caseId: number): Promise<CaseDataForDto> {
    return await fetchCase(this.postgres, caseId, this.forceIds)
  }

  async fetchCases(pagination: Pagination): Promise<CaseDataForIndexDto[]> {
    // TODO: Create Use Case
    // TODO: Add methods for `fetchNotes` and `fetchTriggers`
    // TODO: Add tests
    // TODO: Add Permissions
    // TODO: Add filters one by one
    // TODO: Reuse triggerSql for filtering
    const cases = await fetchCases(this.postgres, this.forceIds, pagination)

    if (cases.length === 0) {
      return []
    }

    const errorIds = cases.map((caseData) => caseData.error_id)

    const notes = await fetchNotes(this.postgres, errorIds)
    const triggers = await fetchTriggers(this.postgres, errorIds)

    cases.forEach((caseData) => {
      const matchedNotes = notes.filter((note) => note.error_id === caseData.error_id)
      const matchedTriggers = triggers.filter((trigger) => trigger.error_id === caseData.error_id)

      matchedNotes.forEach((note) => {
        if (!caseData.notes) {
          caseData.notes = []
        }

        caseData.notes.push(note)
      })

      matchedTriggers.forEach((trigger) => {
        if (!caseData.triggers) {
          caseData.triggers = []
        }

        caseData.triggers.push(trigger)
      })
    })

    return cases
  }

  async fetchUserByUsername(username: string): Promise<User> {
    return await fetchUserByUsername(this.postgres, username)
  }

  async lockCase(
    callbackSql: postgres.Sql,
    lockReason: LockReason,
    caseId: number,
    username: string
  ): Promise<boolean> {
    if (lockReason === LockReason.Exception) {
      return await lockException(callbackSql, caseId, username, this.forceIds)
    } else if (lockReason === LockReason.Trigger) {
      return await lockTrigger(callbackSql, caseId, username, this.forceIds)
    }

    return false
  }

  async selectCaseMessageId(caseId: number): Promise<CaseMessageId> {
    return await selectMessageId(this.postgres, caseId, this.forceIds)
  }

  async transaction(callback: (callbackSql: postgres.Sql) => unknown): Promise<unknown> {
    return await transaction(this.postgres, callback)
  }
}

export default Postgres
