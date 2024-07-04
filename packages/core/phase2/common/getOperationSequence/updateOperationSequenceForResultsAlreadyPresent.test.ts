import type { Operation } from "../../../types/PncUpdateDataset"
import updateOperationSequenceForResultsAlreadyPresent from "./updateOperationSequenceForResultsAlreadyPresent"

describe("check updateOperationSequenceForResultsAlreadyPresent", () => {
  it("If all results are already on the PNC, remove all operations except for NEWREM", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const disarr: Operation = {
      code: "DISARR",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const newrem: Operation = {
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

    const operations = [sendef, newrem, disarr]
    const filteredOperations = updateOperationSequenceForResultsAlreadyPresent(operations, true)

    expect(filteredOperations).toHaveLength(1)
  })

  it("returns operations if not already on PNC", () => {
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const disarr: Operation = {
      code: "DISARR",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const newrem: Operation = {
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

    const operations = [sendef, newrem, disarr]
    const result = updateOperationSequenceForResultsAlreadyPresent(operations, false)

    expect(result).toEqual(operations)
  })
})
