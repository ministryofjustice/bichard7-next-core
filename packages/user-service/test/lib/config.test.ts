import { getConfig } from "lib/config"

describe("config", () => {
  afterEach(() => {
    delete process.env.AUDIT_LOG_API_URL
    delete process.env.AUDIT_LOG_API_KEY
  })

  it("should return the console audit logger type when audit log api key is not provided", () => {
    process.env.AUDIT_LOG_API_URL = "dummy_url"

    const defaultConfig = getConfig()

    expect(defaultConfig.auditLoggerType).toBe("console")
  })

  it("should return the console audit logger type when audit log api url is not provided", () => {
    process.env.AUDIT_LOG_API_KEY = "dummy_key"

    const defaultConfig = getConfig()

    expect(defaultConfig.auditLoggerType).toBe("console")
  })

  it("should return the audit-log-api audit logger type when audit log api url and key are provided", () => {
    process.env.AUDIT_LOG_API_URL = "dummy_url"
    process.env.AUDIT_LOG_API_KEY = "dummy_key"

    const defaultConfig = getConfig()

    expect(defaultConfig.auditLoggerType).toBe("audit-log-api")
  })
})
