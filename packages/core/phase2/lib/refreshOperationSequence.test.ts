jest.mock("../lib/getOperationSequence")
import type { Operation } from "../../types/PncUpdateDataset"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import { getOperationSequence } from "./getOperationSequence"
import refreshOperationSequence from "./refreshOperationSequence"

const mockedGetOperationSequence = getOperationSequence as jest.Mock

describe("refreshOperationSequence", () => {
  beforeEach(() => {
    mockedGetOperationSequence.mockReturnValue([{ code: "DISARR", data: undefined, status: "NotAttempted" }])
  })

  it("adds PNC operations if no existing operations", () => {
    const pncUpdateDataset = generateFakePncUpdateDataset()

    refreshOperationSequence(pncUpdateDataset)

    expect(pncUpdateDataset.PncOperations).toStrictEqual([{ code: "DISARR", data: undefined, status: "NotAttempted" }])
  })

  it("adds no PNC operations if no existing and new operations", () => {
    mockedGetOperationSequence.mockReturnValue([])
    const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: [] })

    refreshOperationSequence(pncUpdateDataset)

    expect(pncUpdateDataset.PncOperations).toStrictEqual([])
  })

  describe("when there are existing PNC operations with NEWREM", () => {
    describe("and existing NEWREM operation status is completed", () => {
      it("keeps both new and existing operations when data does not match", () => {
        mockedGetOperationSequence.mockReturnValue([{ code: "NEWREM", data: undefined, status: "NotAttempted" }])
        const pncOperations = [
          {
            status: "Completed",
            code: "NEWREM",
            data: { nextHearingDate: new Date("2024-05-28") }
          } as unknown as Operation,
          {
            status: "Completed",
            code: "DISARR"
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        refreshOperationSequence(pncUpdateDataset)

        expect(pncUpdateDataset.PncOperations).toStrictEqual([
          {
            status: "Completed",
            code: "NEWREM",
            data: { nextHearingDate: new Date("2024-05-28") }
          },
          { status: "Completed", code: "DISARR" },
          { code: "NEWREM", data: undefined, status: "NotAttempted" }
        ])
      })

      it("keeps only the existing operations when data does match", () => {
        mockedGetOperationSequence.mockReturnValue([{ code: "NEWREM", data: undefined, status: "NotAttempted" }])
        const pncOperations = [
          {
            status: "Completed",
            code: "NEWREM"
          } as unknown as Operation,
          {
            status: "Completed",
            code: "DISARR"
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        refreshOperationSequence(pncUpdateDataset)

        expect(pncUpdateDataset.PncOperations).toStrictEqual(pncOperations)
      })

      it("keeps only the existing operations when no new operations", () => {
        mockedGetOperationSequence.mockReturnValue([])
        const pncOperations = [
          {
            status: "Completed",
            code: "NEWREM",
            data: { nextHearingDate: new Date("2024-05-28") }
          } as unknown as Operation,
          {
            status: "Completed",
            code: "DISARR"
          } as unknown as Operation
        ]
        const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

        refreshOperationSequence(pncUpdateDataset)

        expect(pncUpdateDataset.PncOperations).toStrictEqual([
          {
            status: "Completed",
            code: "NEWREM",
            data: { nextHearingDate: new Date("2024-05-28") }
          },
          { status: "Completed", code: "DISARR" }
        ])
      })
    })

    it("removes the NEWREM operation if it hasn't been attempted", () => {
      const pncOperations = [
        {
          status: "NotAttempted",
          code: "NEWREM"
        } as unknown as Operation,
        {
          status: "Completed",
          code: "DISARR"
        } as unknown as Operation
      ]
      const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

      refreshOperationSequence(pncUpdateDataset)

      expect(pncUpdateDataset.PncOperations).toStrictEqual([pncOperations[1]])
    })

    it("removes the NEWREM operation if it has failed", () => {
      const pncOperations = [
        {
          status: "Completed",
          code: "DISARR"
        } as unknown as Operation,
        {
          status: "Failed",
          code: "NEWREM"
        } as unknown as Operation
      ]
      const pncUpdateDataset = generateFakePncUpdateDataset({ PncOperations: pncOperations })

      refreshOperationSequence(pncUpdateDataset)

      expect(pncUpdateDataset.PncOperations).toStrictEqual([pncOperations[0]])
    })
  })
})
