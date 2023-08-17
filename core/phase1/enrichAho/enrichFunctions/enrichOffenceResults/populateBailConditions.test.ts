import type { Result } from "core/common/types/AnnotatedHearingOutcome"
import populateBailConditions from "./populateBailConditions"

describe("populateBailConditions", () => {
  it("should populate the BailCondition elements with matching descriptions", () => {
    const ahoResult = { ResultQualifierVariable: [{ Code: "JK" }] } as Result
    populateBailConditions(ahoResult)
    expect(ahoResult.BailCondition).toStrictEqual(["Condition - No contact - not contact directly or indirectly"])
  })

  it("should populate the BailCondition elements with multiple matching descriptions", () => {
    const ahoResult = { ResultQualifierVariable: [{ Code: "JK" }, { Code: "JZ" }] } as Result
    populateBailConditions(ahoResult)
    expect(ahoResult.BailCondition).toStrictEqual([
      "Condition - No contact - not contact directly or indirectly",
      "Condition - report to a probation office"
    ])
  })

  it("should not populate the BailCondition elements if no result qualifiers match", () => {
    const ahoResult = { ResultQualifierVariable: [{ Code: "JC" }] } as Result
    populateBailConditions(ahoResult)
    expect(ahoResult.BailCondition).toStrictEqual([])
  })

  it("should not populate the BailCondition element if no result qualifiers is in the lookup", () => {
    const ahoResult = { ResultQualifierVariable: [{ Code: "JI" }] } as Result
    populateBailConditions(ahoResult)
    expect(ahoResult.BailCondition).toStrictEqual([])
  })
})
