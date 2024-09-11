import { PncOperation } from "../../../../types/PncOperation"
import type { Operation } from "../../../../types/PncUpdateDataset"
import filterDisposalsAddedInCourt from "./filterDisposalsAddedInCourt"

const remandOperation: Operation = {
  code: PncOperation.REMAND,
  data: undefined,
  courtCaseReference: "444",
  isAdjournmentPreJudgement: true,
  status: "NotAttempted"
}

const disposalOperationAddedInCourt: Operation = {
  code: "DISARR",
  data: { courtCaseReference: "444" },
  addedByTheCourt: true,
  status: "NotAttempted"
}

const disposalOperation: Operation = {
  code: "DISARR",
  data: { courtCaseReference: "444" },
  status: "NotAttempted"
}

describe("filterDisposalsAddedInCourt", () => {
  describe("addedByTheCourt is true and isAdjournmentPreJudgement is true", () => {
    it("should leave added in court disposal operation when CCR matches remand operation's CCR", () => {
      const operations: Operation[] = [remandOperation, disposalOperationAddedInCourt]

      const filteredOperations = filterDisposalsAddedInCourt(operations)

      expect(filteredOperations).toStrictEqual([remandOperation, disposalOperationAddedInCourt])
    })

    it("should remove added in court disposal operation when CCR does not match remand operation's CCR", () => {
      const nonMatchingRemandOperation = { ...remandOperation, courtCaseReference: "555" }
      const operations: Operation[] = [nonMatchingRemandOperation, disposalOperationAddedInCourt]

      const filteredOperations = filterDisposalsAddedInCourt(operations)

      expect(filteredOperations).toStrictEqual([nonMatchingRemandOperation])
    })

    it("should remove added in court disposal operation when disposal operation does not have data", () => {
      const operations: Operation[] = [remandOperation, { ...disposalOperationAddedInCourt, data: undefined }]

      const filteredOperations = filterDisposalsAddedInCourt(operations)

      expect(filteredOperations).toStrictEqual([remandOperation])
    })

    it("should sort operations so added in court disposal operations are at the end", () => {
      const operations: Operation[] = [
        disposalOperationAddedInCourt,
        remandOperation,
        disposalOperationAddedInCourt,
        disposalOperation
      ]

      const filteredOperations = filterDisposalsAddedInCourt(operations)

      expect(filteredOperations).toStrictEqual([
        remandOperation,
        disposalOperation,
        disposalOperationAddedInCourt,
        disposalOperationAddedInCourt
      ])
    })
  })
})
