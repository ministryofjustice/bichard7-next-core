import type { Operation } from "../types/PncUpdateDataset"
import generateAhoFromOffenceList from "./tests/fixtures/helpers/generateAhoFromOffenceList"
import validateOperationSequence from "./validateOperationSequence"

describe("check validateOperationsSequence", () => {
  const aho = generateAhoFromOffenceList([])

  it("No operations and operations already on the Pnc should have valid operation sequence", () => {
    const result = validateOperationSequence([], true, aho, new Set())
    expect(result).toBe(true)
  })

  it("No operations and not all results already on the Pnc should have invalid operation sequence", () => {
    const result = validateOperationSequence([], false, aho, new Set())
    expect(result).toBe(false)
  })

  it("If SENDEF coexists with NEWREM, the validation fails and an exception is added to the Aho", () => {
    const aho = generateAhoFromOffenceList([])
    const sendef: Operation = {
      code: "SENDEF",
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

    const operations = [sendef, newrem]
    const result = validateOperationSequence(operations, false, aho, new Set())

    expect(result).toBe(false)
    expect(aho.Exceptions).toHaveLength(1)
  })

  it("If SENDEF coexists with PENHRG, the validation fails and an exception is added to the Aho", () => {
    const aho = generateAhoFromOffenceList([])
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const penhrg: Operation = {
      code: "PENHRG",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }

    const operations = [sendef, penhrg]
    const result = validateOperationSequence(operations, false, aho, new Set())

    expect(result).toBe(false)
    expect(aho.Exceptions).toHaveLength(1)
  })

  it("PENHRG cannot coexist with any court case-specific operation", () => {
    const aho = generateAhoFromOffenceList([])
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const penhrg: Operation = {
      code: "PENHRG",
      status: "Completed",
      data: {
        courtCaseReference: "BAR"
      }
    }

    const operations = [sendef, penhrg]
    const result = validateOperationSequence(operations, false, aho, new Set())

    expect(result).toBe(false)
    expect(aho.Exceptions).toHaveLength(1)
  })

  it("If remandCcrs contain SENDEF court case reference, the validation fails and an exception is added to the Aho", () => {
    const aho = generateAhoFromOffenceList([])
    const sendef: Operation = {
      code: "SENDEF",
      status: "Completed",
      data: {
        courtCaseReference: "FOO"
      }
    }
    const remandCcrs = new Set(["FOO"])

    const operations = [sendef]
    const result = validateOperationSequence(operations, false, aho, remandCcrs)

    expect(result).toBe(false)
    expect(aho.Exceptions).toHaveLength(1)
  })
})
