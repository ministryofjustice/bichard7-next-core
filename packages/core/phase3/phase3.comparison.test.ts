import "jest-xml-matcher"

import "../tests/helpers/setEnvironmentVariables"

import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import fs from "fs"
import "jest-xml-matcher"

import type { ParseIncomingMessageResult } from "../comparison/lib/parseIncomingMessage"
import type { Phase3E2eComparison } from "../comparison/types/ComparisonFile"
import type ErrorListRecord from "../types/ErrorListRecord"
import type ErrorListTriggerRecord from "../types/ErrorListTriggerRecord"
import type { PncException } from "../types/Exception"
import type Phase3Result from "./types/Phase3Result"

import { normalisePncOperations } from "../comparison/lib/comparePhase3"
import MockPncGateway from "../comparison/lib/MockPncGateway"
import parseIncomingMessage from "../comparison/lib/parseIncomingMessage"
import processTestFile from "../comparison/lib/processTestFile"
import CoreAuditLogger from "../lib/auditLog/CoreAuditLogger"
import saveErrorListRecord from "../lib/database/saveErrorListRecord"
import { PncApiError } from "../lib/pnc/PncGateway"
import serialiseToXml from "../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import {
  clearDatabase,
  disconnectDb,
  insertRecords,
  normaliseTriggers,
  sortTriggers,
  sql
} from "../tests/helpers/e2eComparisonTestsHelpers"
import { isPncUpdateDataset } from "../types/PncUpdateDataset"
import { isPncLockError } from "./exceptions/generatePncUpdateExceptionFromMessage"
import { MAXIMUM_PNC_LOCK_ERROR_RETRIES } from "./lib/updatePnc"
import phase3 from "./phase3"
import getPncOperationsFromPncUpdateDataset from "./tests/helpers/getPncOperationsFromPncUpdateDataset"
import PncUpdateRequestError from "./types/PncUpdateRequestError"

const normaliseXml = (xml?: string): string =>
  xml
    ?.replace(/ Error="HO200200"/g, "")
    .replace(/ hasError="false"/g, "")
    .replace(' standalone="yes"', "") ?? ""

const checkDatabaseMatches = async (expected: any): Promise<void> => {
  const errorList = await sql<ErrorListRecord[]>`select * from BR7OWN.ERROR_LIST`
  const errorListTriggers = await sql<ErrorListTriggerRecord[]>`select * from BR7OWN.ERROR_LIST_TRIGGERS`
  const expectedTriggers = errorListTriggers.map((trigger) => trigger.trigger_code)

  if (expected.errorList.length === 0 && expected.errorListTriggers.length == 0) {
    expect(errorList).toHaveLength(0)
    expect(errorListTriggers).toHaveLength(0)
    return
  }

  expect(errorList).toHaveLength(expected.errorList.length)
  const expectedError = expected.errorList[0]

  expect(errorList[0].message_id).toEqual(expectedError.message_id)
  expect(errorList[0].phase).toEqual(expectedError.phase)
  expect(errorList[0].error_status).toEqual(expectedError.error_status)
  expect(errorList[0].trigger_status).toEqual(expectedError.trigger_status)
  expect(errorList[0].error_quality_checked).toEqual(expectedError.error_quality_checked)
  expect(errorList[0].trigger_quality_checked).toEqual(expectedError.trigger_quality_checked)
  expect(errorList[0].trigger_count).toEqual(expectedError.trigger_count)
  expect(errorList[0].is_urgent).toEqual(expectedError.is_urgent)
  expect(errorList[0].asn).toEqual(expectedError.asn)
  expect(errorList[0].court_code).toEqual(expectedError.court_code)
  expect(normaliseXml(errorList[0].annotated_msg)).toEqualXML(normaliseXml(expectedError.annotated_msg))
  expect(normaliseXml(errorList[0].updated_msg)).toEqualXML(normaliseXml(expectedError.updated_msg))
  expect(errorList[0].error_report).toEqual(expectedError.error_report)
  expect(errorList[0].create_ts).toBeDefined()
  expect(errorList[0].error_reason).toEqual(expectedError.error_reason)

  if (expectedError.trigger_reason) {
    expect(expectedTriggers).toContain(errorList[0].trigger_reason)
  } else {
    expect(errorList[0].trigger_reason).toBeNull()
  }

  expect(errorList[0].error_count).toEqual(expectedError.error_count)
  expect(errorList[0].court_date).toEqual(expectedError.court_date)
  expect(errorList[0].ptiurn).toEqual(expectedError.ptiurn)
  expect(errorList[0].court_name).toEqual(expectedError.court_name)
  expect(errorList[0].msg_received_ts).toBeDefined()
  expect(errorList[0].trigger_resolved_ts).toEqual(expectedError.trigger_resolved_ts)
  expect(errorList[0].defendant_name).toEqual(expectedError.defendant_name)
  expect(errorList[0].org_for_police_filter).toEqual(expectedError.org_for_police_filter)
  expect(errorList[0].court_room).toEqual(expectedError.court_room)
  expect(errorList[0].court_reference).toEqual(expectedError.court_reference)
  expect(errorList[0].error_insert_ts).toBeDefined()
  expect(errorList[0].trigger_insert_ts).toBeDefined()
  expect(errorList[0].pnc_update_enabled).toEqual(expectedError.pnc_update_enabled)

  expect(errorListTriggers).toHaveLength(expected.errorListTriggers.length)
  expect(normaliseTriggers(errorListTriggers)).toStrictEqual(normaliseTriggers(expected.errorListTriggers))
}

const filePath = "phase3/tests/fixtures/e2e-comparison"
// const ignored: string[] = ["001", "006", "007", "019", "018"]
const ignored: string[] = []

const filter = process.env.FILTER_TEST
// const filter = "001"

const tests = fs
  .readdirSync(filePath)
  .filter((name) => {
    if (filter) {
      return name.includes(`test-${filter}`)
    } else {
      return !ignored.some((i) => name.includes(`test-${i}`))
    }
  })
  .map((name) => `${filePath}/${name}`)
  .map(processTestFile) as Phase3E2eComparison[]

describe("phase3", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  describe.each(tests)("should correctly process $file", (comparison: Phase3E2eComparison) => {
    let phase3Result: Phase3Result
    let parsedOutgoingMessage: ParseIncomingMessageResult
    let mockPncGateway: MockPncGateway
    let pncExceptions: PncException[]

    beforeEach(async () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase3)
      const parsedIncomingMessage = parseIncomingMessage(comparison.incomingMessage)
      if (!isPncUpdateDataset(parsedIncomingMessage.message)) {
        throw new Error("Incompatible incoming message type")
      }

      parsedOutgoingMessage = parseIncomingMessage(comparison.outgoingMessage)

      if (!isPncUpdateDataset(parsedOutgoingMessage.message)) {
        throw new Error("Incompatible outgoing message type")
      }

      pncExceptions = parsedOutgoingMessage.message?.Exceptions.filter((exception) => "message" in exception) ?? []

      const mockPncResponses: (PncApiError | undefined)[] = []

      const beforeOperations = getPncOperationsFromPncUpdateDataset(parsedIncomingMessage.message)
      const beforeUnattemptedOperations = beforeOperations.filter((operation) => operation.status !== "Completed")
      const afterOperations = getPncOperationsFromPncUpdateDataset(parsedOutgoingMessage.message)
      const afterUnattemptedOperations = afterOperations.filter((operation) => operation.status === "NotAttempted")
      const afterFailedOperations = afterOperations.filter((operation) => operation.status === "Failed")

      const completedOperationCount =
        beforeUnattemptedOperations.length - afterUnattemptedOperations.length - afterFailedOperations.length

      mockPncResponses.push(...Array.from({ length: completedOperationCount }, () => undefined))

      if (pncExceptions.length > 0) {
        const pncApiError = new PncApiError(pncExceptions.map((exception) => exception.message))

        mockPncResponses.push(pncApiError)

        if (pncExceptions?.some(isPncLockError)) {
          mockPncResponses.push(...Array.from({ length: MAXIMUM_PNC_LOCK_ERROR_RETRIES - 1 }, () => pncApiError))
        }
      }

      mockPncGateway = new MockPncGateway(mockPncResponses)

      const result = await phase3(parsedIncomingMessage.message, mockPncGateway, auditLogger)

      if (result instanceof PncUpdateRequestError) {
        throw new Error(result.message)
      }

      phase3Result = result
    })

    it("should generate the correct xml", () => {
      const expectedOutput = normaliseXml(comparison.outgoingMessage)
      const actualOutput = normaliseXml(serialiseToXml(phase3Result.outputMessage, true))

      expect(actualOutput).toEqualXML(expectedOutput)
    })

    it("should generate the correct triggers", () => {
      const expectedTriggers = sortTriggers(comparison.triggers)
      const actualTriggers = sortTriggers(phase3Result.triggers)

      expect(actualTriggers).toStrictEqual(expectedTriggers)
    })

    it("should generate the correct PNC operations", () => {
      const expectedPncOperations = comparison.pncOperations
      normalisePncOperations(expectedPncOperations)
      normalisePncOperations(mockPncGateway.updates)

      const actualPncOperations =
        pncExceptions && pncExceptions.length > 0
          ? mockPncGateway.updates.slice(0, pncExceptions?.some(isPncLockError) ? -MAXIMUM_PNC_LOCK_ERROR_RETRIES : -1)
          : mockPncGateway.updates

      expect(actualPncOperations).toStrictEqual(expectedPncOperations)
    })

    // eslint-disable-next-line jest/expect-expect
    it("should store the data correctly in the database", async () => {
      await insertRecords(comparison.db.before)

      await saveErrorListRecord(sql, phase3Result)

      await checkDatabaseMatches(comparison.db.after)
    })
  })
})
