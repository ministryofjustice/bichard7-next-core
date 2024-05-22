import type { Operation } from "../../../types/PncUpdateDataset"
import addOaacDisarrOperationsIfNecessary from "./addOaacDisarrOperationsIfNecessary"

describe("addOaacDisarrOperationsIfNecessary", () => {
  it("should add oAAC DISARR operation to main operations when CCR has value and is in adjPreJudgementRemandCcrs", () => {
    const mainOperations: Operation[] = []
    const oAacDisarrOperations: Operation[] = [
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ]
    const adjPreJudgementRemandCcrs = new Set(["444"])

    addOaacDisarrOperationsIfNecessary(mainOperations, oAacDisarrOperations, adjPreJudgementRemandCcrs)

    expect(mainOperations).toStrictEqual([
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ])
    expect(oAacDisarrOperations).toStrictEqual([
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ])
    expect([...adjPreJudgementRemandCcrs]).toStrictEqual(["444"])
  })

  it("should not add oAAC DISARR operation to main operations when CCR has value but is not in adjPreJudgementRemandCcrs", () => {
    const mainOperations: Operation[] = []
    const oAacDisarrOperations: Operation[] = [
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ]
    const adjPreJudgementRemandCcrs = new Set([])

    addOaacDisarrOperationsIfNecessary(mainOperations, oAacDisarrOperations, adjPreJudgementRemandCcrs)

    expect(mainOperations).toStrictEqual([])
    expect(oAacDisarrOperations).toStrictEqual([
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ])
    expect([...adjPreJudgementRemandCcrs]).toStrictEqual([])
  })

  it("should not add oAAC DISARR operation to main operations when oAAC operation doesn't have data", () => {
    const mainOperations: Operation[] = []
    const oAacDisarrOperations: Operation[] = [{ code: "DISARR", data: undefined, status: "NotAttempted" }]
    const adjPreJudgementRemandCcrs = new Set(["444"])

    addOaacDisarrOperationsIfNecessary(mainOperations, oAacDisarrOperations, adjPreJudgementRemandCcrs)

    expect(mainOperations).toStrictEqual([])
    expect(oAacDisarrOperations).toStrictEqual([{ code: "DISARR", data: undefined, status: "NotAttempted" }])
    expect([...adjPreJudgementRemandCcrs]).toStrictEqual(["444"])
  })

  it("should not add any operation to main operations when oAAC operation code is not DISARR", () => {
    const mainOperations: Operation[] = []
    const oAacDisarrOperations: Operation[] = [
      { code: "PENHRG", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ]
    const adjPreJudgementRemandCcrs = new Set(["444"])

    addOaacDisarrOperationsIfNecessary(mainOperations, oAacDisarrOperations, adjPreJudgementRemandCcrs)

    expect(mainOperations).toStrictEqual([])
    expect(oAacDisarrOperations).toStrictEqual([
      { code: "PENHRG", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ])
    expect([...adjPreJudgementRemandCcrs]).toStrictEqual(["444"])
  })

  it("should not add oAAC DISARR operation to main operations when there is already a DISARR operation with the same data", () => {
    const mainOperations: Operation[] = [
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ]
    const oAacDisarrOperations: Operation[] = [
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ]
    const adjPreJudgementRemandCcrs = new Set([])

    addOaacDisarrOperationsIfNecessary(mainOperations, oAacDisarrOperations, adjPreJudgementRemandCcrs)

    expect(mainOperations).toStrictEqual([
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ])
    expect(oAacDisarrOperations).toStrictEqual([
      { code: "DISARR", data: { courtCaseReference: "444" }, status: "NotAttempted" }
    ])
    expect([...adjPreJudgementRemandCcrs]).toStrictEqual([])
  })
})
