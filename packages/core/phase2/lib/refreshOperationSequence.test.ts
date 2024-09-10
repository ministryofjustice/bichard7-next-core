import type { Operation } from "../../types/PncUpdateDataset"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import { PncOperation } from "../../types/PncOperation"
import refreshOperationSequence from "./refreshOperationSequence"

const defaultOperations: Operation[] = [{ code: PncOperation.NORMAL_DISPOSAL, data: undefined, status: "NotAttempted" }]

describe("refreshOperationSequence", () => {
  it("adds PNC operations if no existing operations", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()

    refreshOperationSequence(pncUpdateDataset, defaultOperations)

    expect(pncUpdateDataset.PncOperations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: undefined, status: "NotAttempted" }
    ])
  })

  it("adds no PNC operations if no existing and new operations", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: [] })

    refreshOperationSequence(pncUpdateDataset, [])

    expect(pncUpdateDataset.PncOperations).toStrictEqual([])
  })

  describe("when there are existing PNC operations with NEWREM", () => {
    describe("and existing NEWREM operation status is completed", () => {
      it("keeps both new and existing operations when data does not match", () => {
        const operations: Operation[] = [{ code: PncOperation.REMAND, data: undefined, status: "NotAttempted" }]
        const pncOperations = [
          {
            status: "Completed",
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") }
          } as unknown as Operation,
          {
            status: "Completed",
            code: PncOperation.NORMAL_DISPOSAL
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        refreshOperationSequence(pncUpdateDataset, operations)

        expect(pncUpdateDataset.PncOperations).toStrictEqual([
          {
            status: "Completed",
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") }
          },
          { status: "Completed", code: PncOperation.NORMAL_DISPOSAL },
          { code: PncOperation.REMAND, data: undefined, status: "NotAttempted" }
        ])
      })

      it("keeps only the existing operations when data does match", () => {
        const operations: Operation[] = [{ code: PncOperation.REMAND, data: undefined, status: "NotAttempted" }]
        const pncOperations = [
          {
            status: "Completed",
            code: PncOperation.REMAND
          } as unknown as Operation,
          {
            status: "Completed",
            code: PncOperation.NORMAL_DISPOSAL
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        refreshOperationSequence(pncUpdateDataset, operations)

        expect(pncUpdateDataset.PncOperations).toStrictEqual(pncOperations)
      })

      it("keeps only the existing operations when no new operations", () => {
        const pncOperations = [
          {
            status: "Completed",
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") }
          } as unknown as Operation,
          {
            status: "Completed",
            code: PncOperation.NORMAL_DISPOSAL
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        refreshOperationSequence(pncUpdateDataset, [])

        expect(pncUpdateDataset.PncOperations).toStrictEqual([
          {
            status: "Completed",
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") }
          },
          { status: "Completed", code: PncOperation.NORMAL_DISPOSAL }
        ])
      })
    })

    it("removes the NEWREM operation if it hasn't been attempted", () => {
      const pncOperations = [
        {
          status: "NotAttempted",
          code: PncOperation.REMAND
        } as unknown as Operation,
        {
          status: "Completed",
          code: PncOperation.NORMAL_DISPOSAL
        } as unknown as Operation
      ]
      const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

      refreshOperationSequence(pncUpdateDataset, defaultOperations)

      expect(pncUpdateDataset.PncOperations).toStrictEqual([pncOperations[1]])
    })

    it("removes the NEWREM operation if it has failed", () => {
      const pncOperations = [
        {
          status: "Completed",
          code: PncOperation.NORMAL_DISPOSAL
        } as unknown as Operation,
        {
          status: "Failed",
          code: PncOperation.REMAND
        } as unknown as Operation
      ]
      const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

      refreshOperationSequence(pncUpdateDataset, defaultOperations)

      expect(pncUpdateDataset.PncOperations).toStrictEqual([pncOperations[0]])
    })
  })
})
