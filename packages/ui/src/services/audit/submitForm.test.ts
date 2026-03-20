import submitForm from "./submitForm"
import type { FormState } from "../../types/audit/FormState"
import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { CreateAuditInput } from "@moj-bichard7/common/contracts/CreateAuditInput"

describe("submitForm", () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.clearAllMocks()

    global.fetch = jest.fn()
  })

  afterAll(() => {
    global.fetch = originalFetch
    jest.restoreAllMocks()
  })

  it("should set the audit id when successful", async () => {
    const mockApiResponse: AuditDto = {
      auditId: 1122,
      fromDate: "2026-01-01",
      toDate: "2026-01-02",
      includedTypes: ["Triggers"],
      resolvedByUsers: ["user01"],
      triggerTypes: ["TRPR0010"],
      volumeOfCases: 20,
      createdBy: "test",
      createdWhen: "2026-01-03",
      completedWhen: null
    }

    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockApiResponse)
    })

    const formData = new FormData()
    formData.set("fromDate", "2026-01-01")
    formData.set("toDate", "2026-01-02")
    formData.set("includeTriggers", "on")
    formData.set("includeExceptions", "on")
    formData.set("volume", "20")
    formData.set("resolvedBy", "user01")
    formData.set("triggers", "TRPR0010")

    const result = await submitForm({} as FormState, formData)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      "/bichard/api/audit",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
    )

    const expectedRequest: CreateAuditInput = {
      fromDate: "2026-01-01",
      toDate: "2026-01-02",
      includedTypes: ["Exceptions", "Triggers"],
      resolvedByUsers: ["user01"],
      volumeOfCases: 20,
      triggerTypes: ["TRPR0010"]
    }

    const requestInit = (global.fetch as jest.Mock).mock.calls[0][1] as RequestInit
    expect(JSON.parse(requestInit.body as string)).toEqual(expectedRequest)

    expect(result.errorMessage).toBeUndefined()
    expect(result.auditId).toBe(1122)
  })

  it("should set the error message when unsuccessful", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false
    })

    const formData = new FormData()

    const result = await submitForm({} as FormState, formData)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      "/bichard/api/audit",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" }
      })
    )

    expect(result.errorMessage).toBe("There was a problem creating the audit report")
    expect(result.auditId).toBeUndefined()
  })
})
