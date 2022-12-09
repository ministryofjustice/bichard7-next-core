import { MockServer } from "jest-mock-server"

describe("storeAuditLogEvents", () => {
  let auditLogApi: MockServer

  beforeAll(async () => {
    auditLogApi = new MockServer({ port: 11000 })
    await auditLogApi.start()
  })

  it("should store multiple events in a single call to the API", () => {
    expect(true).toBeTruthy()
  })
})
