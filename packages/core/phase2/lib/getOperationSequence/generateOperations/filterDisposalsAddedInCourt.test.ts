import type { Operation } from "../../../../types/PncUpdateDataset"
import filterDisposalsAddedInCourt from "./filterDisposalsAddedInCourt"

const remandOperation: Operation = {
  code: "NEWREM",
  data: undefined,
  courtCaseReference: "444",
  isAdjournmentPreJudgement: true,
  status: "NotAttempted"
}

const disposalOperation: Operation = {
  code: "DISARR",
  data: { courtCaseReference: "444" },
  addedByTheCourt: true,
  status: "NotAttempted"
}

describe("filterDisposalsAddedInCourt", () => {
  describe("addedByTheCourt is true and isAdjournmentPreJudgement is true", () => {
    it("should leave added in court disposal operation when CCR matches remand operation's CCR", () => {
      const operations: Operation[] = [remandOperation, disposalOperation]

      const filteredOperations = filterDisposalsAddedInCourt(operations)

      expect(filteredOperations).toStrictEqual([remandOperation, disposalOperation])
    })

    it("should remove added in court disposal operation when CCR does not match remand operation's CCR", () => {
      const nonMatchingRemandOperation = { ...remandOperation, courtCaseReference: "555" }
      const operations: Operation[] = [nonMatchingRemandOperation, disposalOperation]

      const filteredOperations = filterDisposalsAddedInCourt(operations)

      expect(filteredOperations).toStrictEqual([nonMatchingRemandOperation])
    })

    it("should remove added in court disposal operation when disposal operation does not have data", () => {
      const operations: Operation[] = [remandOperation, { ...disposalOperation, data: undefined }]

      const filteredOperations = filterDisposalsAddedInCourt(operations)

      expect(filteredOperations).toStrictEqual([remandOperation])
    })
  })
})
