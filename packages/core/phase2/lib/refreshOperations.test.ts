import type { Operation } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import refreshOperations from "./refreshOperations"

const defaultOperations: Operation[] = [{ code: PncOperation.NORMAL_DISPOSAL, data: undefined, status: "NotAttempted" }]

describe("refreshOperations", () => {
  it("adds police operations if no existing operations", () => {
    const policeUpdateDataset = generateFakePncUpdateDataset()

    const actualOperations = refreshOperations(policeUpdateDataset, defaultOperations)

    expect(actualOperations).toStrictEqual([
      { code: PncOperation.NORMAL_DISPOSAL, data: undefined, status: "NotAttempted" }
    ])
  })

  it("adds no police operations if no existing and new operations", () => {
    const policeUpdateDataset = generateFakePncUpdateDataset({ PncOperations: [] })

    const actualOperations = refreshOperations(policeUpdateDataset, [])

    expect(actualOperations).toStrictEqual([])
  })

  describe("when there are existing police operations with NEWREM", () => {
    describe("and existing NEWREM operation status is completed", () => {
      it("keeps both new and existing operations when data does not match", () => {
        const operations: Operation[] = [{ code: PncOperation.REMAND, data: undefined, status: "NotAttempted" }]
        const policeOperations = [
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
        const policeUpdateDataset = generateFakePncUpdateDataset({ PncOperations: policeOperations })

        const actualOperations = refreshOperations(policeUpdateDataset, operations)

        expect(actualOperations).toStrictEqual([
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
        const policeOperations = [
          {
            status: "Completed",
            code: PncOperation.REMAND
          } as unknown as Operation,
          {
            status: "Completed",
            code: PncOperation.NORMAL_DISPOSAL
          } as unknown as Operation
        ]
        const policeUpdateDataset = generateFakePncUpdateDataset({ PncOperations: policeOperations })

        const actualOperations = refreshOperations(policeUpdateDataset, operations)

        expect(actualOperations).toStrictEqual(policeOperations)
      })

      it("keeps only the existing operations when no new operations", () => {
        const policeOperations = [
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
        const policeUpdateDataset = generateFakePncUpdateDataset({ PncOperations: policeOperations })

        const actualOperations = refreshOperations(policeUpdateDataset, [])

        expect(actualOperations).toStrictEqual([
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
      const policeOperations = [
        {
          status: "NotAttempted",
          code: PncOperation.REMAND
        } as unknown as Operation,
        {
          status: "Completed",
          code: PncOperation.NORMAL_DISPOSAL
        } as unknown as Operation
      ]
      const policeUpdateDataset = generateFakePncUpdateDataset({ PncOperations: policeOperations })

      const actualOperations = refreshOperations(policeUpdateDataset, defaultOperations)

      expect(actualOperations).toStrictEqual([policeOperations[1]])
    })

    it("removes the NEWREM operation if it has failed", () => {
      const policeOperations = [
        {
          status: "Completed",
          code: PncOperation.NORMAL_DISPOSAL
        } as unknown as Operation,
        {
          status: "Failed",
          code: PncOperation.REMAND
        } as unknown as Operation
      ]
      const policeUpdateDataset = generateFakePncUpdateDataset({ PncOperations: policeOperations })

      const actualOperations = refreshOperations(policeUpdateDataset, defaultOperations)

      expect(actualOperations).toStrictEqual([policeOperations[0]])
    })
  })
})
