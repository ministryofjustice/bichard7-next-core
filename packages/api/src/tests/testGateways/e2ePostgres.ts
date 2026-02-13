import type { Case } from "@moj-bichard7/common/types/Case"
import type { Trigger } from "@moj-bichard7/common/types/Trigger"
import type { User } from "@moj-bichard7/common/types/User"

import type DataStoreGateway from "../../types/DatabaseGateway"

import mapCaseRowToCase from "../../services/db/mapCaseRowToCase"
import mapCaseToCaseRow from "../../services/db/mapCaseToCaseRow"
import mapTriggerRowToTrigger from "../../services/db/mapTriggerRowToTrigger"
import mapTriggerToTriggerRow from "../../services/db/mapTriggerToTriggerRow"
import mapUserRowToUser from "../../services/db/mapUserRowToUser"
import mapUserToUserRow from "../../services/db/mapUserToUserRow"
import Postgres from "../../services/gateways/database/Postgres"
import clearAllTables from "./e2ePostgres/clearAllTables"
import insertCase from "./e2ePostgres/insertCase"
import insertTrigger from "./e2ePostgres/insertTrigger"
import insertUser from "./e2ePostgres/insertUser"
import insertUserIntoGroup from "./e2ePostgres/insertUserIntoGroup"
import updateCaseWithException from "./e2ePostgres/updateCaseWithException"
import updateCaseWithTriggers from "./e2ePostgres/updateCaseWithTriggers"

class End2EndPostgres extends Postgres implements DataStoreGateway {
  clearDb(): Promise<boolean> {
    return clearAllTables(this.writable.connection)
  }

  async close(): Promise<void> {
    await this.writable.connection.end()
    await this.readonly.connection.end()
  }

  async createTestCase(caseData: Case): Promise<Case> {
    const caseRow = await insertCase(this.writable.connection, mapCaseToCaseRow(caseData))

    return mapCaseRowToCase(caseRow)
  }

  async createTestTrigger(trigger: Trigger): Promise<Trigger> {
    const triggerRow = await insertTrigger(this.writable.connection, mapTriggerToTriggerRow(trigger))

    return mapTriggerRowToTrigger(triggerRow)
  }

  async createTestUser(user: User): Promise<User> {
    const dbUser = await insertUser(this.writable.connection, mapUserToUserRow(user))

    if (user.groups && user.groups.length > 0) {
      await insertUserIntoGroup(this.writable.connection, dbUser, user.groups)
    }

    dbUser.groups = user.groups

    return mapUserRowToUser(dbUser)
  }

  async getAuditCases(auditId: number) {
    return this.readonly.connection<{ audit_case_id: number; audit_id: number; error_id: number }[]>`
      SELECT *
      FROM br7own.audit_cases
      WHERE audit_id = ${auditId}`
  }

  updateCaseWithException(
    caseId: number,
    exceptionCode: string,
    errorResolvedBy: null | string,
    errorResolvedTimestamp: Date | null,
    errorStatus: number,
    errorReport?: string
  ) {
    return updateCaseWithException(
      this.writable.connection,
      caseId,
      exceptionCode,
      errorResolvedBy,
      errorResolvedTimestamp,
      errorStatus,
      errorReport
    )
  }

  updateCaseWithTriggers(
    caseId: number,
    triggerResolvedBy: null | string,
    triggerResolvedAt: Date | null,
    triggerCount: number,
    triggerStatus: number,
    triggerReason: string
  ) {
    return updateCaseWithTriggers(
      this.writable.connection,
      caseId,
      triggerResolvedBy,
      triggerResolvedAt,
      triggerCount,
      triggerStatus,
      triggerReason
    )
  }
}

export default End2EndPostgres
