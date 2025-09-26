import { UserServiceConfig } from "lib/config"
import getAuditLogger from "lib/getAuditLogger"
import { GetServerSidePropsContext } from "next"
import AuditLogEvent from "types/AuditLogEvent"
import { isError } from "types/Result"

it("should log using audit log api", async () => {
  const testConfig = {
    auditLoggerType: "audit-log-api",
    auditLogApiUrl: "http://localhost:7010",
    auditLogApiKey: "dummy_key"
  } as unknown as UserServiceConfig
  const dummyContext = {
    req: {
      socket: "dummy socket",
      url: "dummy url"
    }
  } as unknown as GetServerSidePropsContext

  const auditLogger = getAuditLogger(dummyContext, testConfig)
  const result = await auditLogger.logEvent(AuditLogEvent.userDetailsEdited, {
    "Attribute 1": "Dummy value",
    "Attribute 2": 100,
    user: {
      username: "User 1"
    }
  })

  console.log(result)
  expect(isError(result)).toBe(false)
})
