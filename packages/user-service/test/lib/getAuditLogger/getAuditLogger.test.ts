import type { UserServiceConfig } from "lib/config"
import config from "lib/config"
import getAuditLogger from "lib/getAuditLogger"
import type { GetServerSidePropsContext } from "next"
import type AuditLogger from "types/AuditLogger"
import { isError } from "types/Result"

it("should throw error when unknown logger type is set in config", () => {
  const testConfig = { auditLoggerType: "dummy_type" } as unknown as UserServiceConfig
  const dummyContext = {} as unknown as GetServerSidePropsContext

  let actualError: Error | undefined
  try {
    getAuditLogger(dummyContext, testConfig)
  } catch (error) {
    actualError = error as Error
  }

  expect(isError(actualError)).toBe(true)
  expect(actualError?.message).toBe("Unknown audit logger type.")
})

it("should keep the audit logger instance in context", () => {
  const testContext = {} as unknown as GetServerSidePropsContext

  const auditLogger = getAuditLogger(testContext, config)

  const { auditLogger: contextAuditLogger } = testContext as unknown as { auditLogger: AuditLogger }

  expect(auditLogger).toEqual(contextAuditLogger)
})

it("should set logError and logEvent in audit logger", () => {
  const testContext = {} as unknown as GetServerSidePropsContext

  const auditLogger = getAuditLogger(testContext, config)

  expect(auditLogger.logError).toBeDefined()
  expect(auditLogger.logEvent).toBeDefined()
})

it("should return the auditLogger in the context", () => {
  const testContext = { auditLogger: { testingAuditLogger: true } } as unknown as GetServerSidePropsContext

  const auditLogger = getAuditLogger(testContext, config)

  expect(auditLogger).toBeDefined()
  expect(auditLogger).toHaveProperty("testingAuditLogger")
})
