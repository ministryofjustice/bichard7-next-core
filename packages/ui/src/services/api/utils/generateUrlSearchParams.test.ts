import { Reason, type ApiCaseQuery } from "@moj-bichard7/common/types/ApiCaseQuery"
import { CaseAge } from "@moj-bichard7/common/types/CaseAge"
import { generateUrlSearchParams } from "services/api/utils/generateUrlSearchParams"

describe("generateUrlSearchParams", () => {
  it("handles numbers", () => {
    const apiCaseQuery: ApiCaseQuery = {
      maxPerPage: 50,
      pageNum: 1,
      reason: Reason.All
    }

    const result = generateUrlSearchParams(apiCaseQuery)

    expect(result.toString()).toContain("maxPerPage=50")
  })

  it("handles arrays", () => {
    const apiCaseQuery: ApiCaseQuery = {
      maxPerPage: 50,
      pageNum: 1,
      reason: Reason.All,
      caseAge: [CaseAge.Today, CaseAge.Yesterday]
    }

    const result = generateUrlSearchParams(apiCaseQuery)

    expect(result.toString()).toContain("caseAge=Today&caseAge=Yesterday")
  })

  it("handles spaces between words", () => {
    const apiCaseQuery: ApiCaseQuery = {
      maxPerPage: 50,
      pageNum: 1,
      reason: Reason.All,
      courtName: "Kings Court"
    }

    const result = generateUrlSearchParams(apiCaseQuery)

    expect(result.toString()).toContain("courtName=Kings+Court")
  })

  it("handles dates", () => {
    const apiCaseQuery: ApiCaseQuery = {
      maxPerPage: 50,
      pageNum: 1,
      reason: Reason.All,
      from: new Date("2025-02-01")
    }

    const result = generateUrlSearchParams(apiCaseQuery)

    expect(result.toString()).toContain("from=2025-02-01")
  })
})
