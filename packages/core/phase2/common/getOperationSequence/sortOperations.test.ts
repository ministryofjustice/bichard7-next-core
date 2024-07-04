import type { Operation } from "../../types/PncUpdateDataset"
import sortOperations from "./sortOperations"

describe("check sortOperations", () => {
  const sendef: Operation = {
    code: "SENDEF",
    status: "Completed",
    data: {
      courtCaseReference: "FOO1"
    }
  }
  const sendef2: Operation = {
    code: "SENDEF",
    status: "Completed",
    data: {
      courtCaseReference: "FOO2"
    }
  }
  const disarr: Operation = {
    code: "DISARR",
    status: "Completed",
    data: {
      courtCaseReference: "FOO"
    }
  }
  const newrem1: Operation = {
    code: "NEWREM",
    status: "Completed",
    data: {
      nextHearingLocation: {
        SecondLevelCode: null,
        BottomLevelCode: null,
        ThirdLevelCode: null,
        OrganisationUnitCode: "ABCDEFG"
      }
    }
  }
  const newrem2: Operation = {
    code: "NEWREM",
    status: "Completed",
    data: {
      nextHearingLocation: {
        SecondLevelCode: null,
        BottomLevelCode: null,
        ThirdLevelCode: null,
        OrganisationUnitCode: "HIJKLMN"
      }
    }
  }
  it("After sorting NEWREM is after other operations", () => {
    const operations = [newrem1, sendef, disarr]
    const result = sortOperations(operations)

    expect(result).toHaveLength(3)
    expect(result).toStrictEqual([sendef, disarr, newrem1])
  })

  it("After sorting ordering of non-NEWREMs is unchanged", () => {
    const operations = [sendef, disarr, sendef2, sendef, newrem1]
    const result = sortOperations(operations)

    expect(result).toStrictEqual([sendef, disarr, sendef2, sendef, newrem1])
  })

  it("After sorting ordering of multiple NEWREMs is preserved", () => {
    const operations = [sendef, newrem1, sendef2, newrem2]
    const result = sortOperations(operations)

    expect(result).toStrictEqual([sendef, sendef2, newrem1, newrem2])
  })
})
