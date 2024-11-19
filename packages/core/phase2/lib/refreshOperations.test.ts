import type { Operation } from "../../types/PncUpdateDataset"

import { PncOperation } from "../../types/PncOperation"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import refreshOperations from "./refreshOperations"

const defaultOperations: Operation[] = [{ code: PncOperation.NORMAL_DISPOSAL, data: undefined, status: "NotAttempted" }]

describe("refreshOperations", () => {
  it("adds PNC operations if no existing operations", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()

    const actualOperations = refreshOperations(pncUpdateDataset, defaultOperations)

    expect(actualOperations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: undefined, status: "NotAttempted" }
    ])
  })

  it("adds no PNC operations if no existing and new operations", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: [] })

    const actualOperations = refreshOperations(pncUpdateDataset, [])

    expect(actualOperations).toStrictEqual([])
  })

  describe("when there are existing PNC operations with NEWREM", () => {
    describe("and existing NEWREM operation status is completed", () => {
      it("keeps both new and existing operations when data does not match", () => {
        const operations: Operation[] = [{ code: PncOperation.REMAND, data: undefined, status: "NotAttempted" }]
        const pncOperations = [
          {
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") },
            status: "Completed"
          } as unknown as Operation,
          {
            code: PncOperation.NORMAL_DISPOSAL,
            status: "Completed"
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        const actualOperations = refreshOperations(pncUpdateDataset, operations)

        expect(actualOperations).toStrictEqual([
          {
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") },
            status: "Completed"
          },
          { code: PncOperation.NORMAL_DISPOSAL, status: "Completed" },
          { code: PncOperation.REMAND, data: undefined, status: "NotAttempted" }
        ])
      })

      it("keeps only the existing operations when data does match", () => {
        const operations: Operation[] = [{ code: PncOperation.REMAND, data: undefined, status: "NotAttempted" }]
        const pncOperations = [
          {
            code: PncOperation.REMAND,
            status: "Completed"
          } as unknown as Operation,
          {
            code: PncOperation.NORMAL_DISPOSAL,
            status: "Completed"
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        const actualOperations = refreshOperations(pncUpdateDataset, operations)

        expect(actualOperations).toStrictEqual(pncOperations)
      })

      it("keeps only the existing operations when no new operations", () => {
        const pncOperations = [
          {
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") },
            status: "Completed"
          } as unknown as Operation,
          {
            code: PncOperation.NORMAL_DISPOSAL,
            status: "Completed"
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        const actualOperations = refreshOperations(pncUpdateDataset, [])

        expect(actualOperations).toStrictEqual([
          {
            code: PncOperation.REMAND,
            data: { nextHearingDate: new Date("2024-05-28") },
            status: "Completed"
          },
          { code: PncOperation.NORMAL_DISPOSAL, status: "Completed" }
        ])
      })
    })

    it("removes the NEWREM operation if it hasn't been attempted", () => {
      const pncOperations = [
        {
          code: PncOperation.REMAND,
          status: "NotAttempted"
        } as unknown as Operation,
        {
          code: PncOperation.NORMAL_DISPOSAL,
          status: "Completed"
        } as unknown as Operation
      ]
      const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

      const actualOperations = refreshOperations(pncUpdateDataset, defaultOperations)

      expect(actualOperations).toStrictEqual([pncOperations[1]])
    })

    it("removes the NEWREM operation if it has failed", () => {
      const pncOperations = [
        {
          code: PncOperation.NORMAL_DISPOSAL,
          status: "Completed"
        } as unknown as Operation,
        {
          code: PncOperation.REMAND,
          status: "Failed"
        } as unknown as Operation
      ]
      const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

      const actualOperations = refreshOperations(pncUpdateDataset, defaultOperations)

      expect(actualOperations).toStrictEqual([pncOperations[0]])
    })
  })
})
