import "jest-xml-matcher"

import "../tests/helpers/setEnvironmentVariables"

import type { PncException } from "@moj-bichard7/common/types/Exception"

import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import "jest-xml-matcher"
import { isPncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { ParseIncomingMessageResult } from "../tests/helpers/parseIncomingMessage"
import type { Phase3E2eComparison } from "../tests/types/ComparisonFile"
import type Phase3Result from "./types/Phase3Result"

import CoreAuditLogger from "../lib/auditLog/CoreAuditLogger"
import saveErrorListRecord from "../lib/database/saveErrorListRecord"
import { PncApiError } from "../lib/pnc/PncGateway"
import serialiseToXml from "../lib/serialise/pncUpdateDatasetXml/serialiseToXml"
import checkDatabaseMatches from "../tests/helpers/comparison/checkDatabaseMatches"
import { clearDatabase, disconnectDb, insertRecords, sql } from "../tests/helpers/comparison/ComparisonTestDbHelpers"
import getComparisonTests from "../tests/helpers/comparison/getComparisonTests"
import normalisePncOperations from "../tests/helpers/comparison/normalisePncOperations"
import normaliseXml from "../tests/helpers/comparison/normaliseXml"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import parseIncomingMessage from "../tests/helpers/parseIncomingMessage"
import sortTriggers from "../tests/helpers/sortTriggers"
import { isPncLockError } from "./exceptions/generatePncUpdateExceptionFromMessage"
import { MAXIMUM_PNC_LOCK_ERROR_RETRIES } from "./lib/updatePnc"
import phase3 from "./phase3"
import getPncOperationsFromPncUpdateDataset from "./tests/helpers/getPncOperationsFromPncUpdateDataset"
import PncUpdateRequestError from "./types/PncUpdateRequestError"

describe("phase3", () => {
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  const tests = getComparisonTests<Phase3E2eComparison>(3)

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
