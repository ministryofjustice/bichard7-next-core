import checkOperationsException from "./checkOperationsException"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import { generateOperationsFromResults } from "../lib/generateOperations/generateOperations"
import { PncOperation } from "../../types/PncOperation"

jest.mock("../lib/generateOperations/generateOperations")

const mockedGenerateOperationsFromResults = generateOperationsFromResults as jest.Mock

mockedGenerateOperationsFromResults.mockReturnValue({
  operations: [{ code: PncOperation.REMAND }, { code: PncOperation.NORMAL_DISPOSAL }]
})

describe("checkOperationsException", () => {
  it("generates operations from results", () => {
    const checkException = jest.fn()
    const aho = generateAhoFromOffenceList([])
    const isResubmitted = false
    const allResultsOnPnc = false

    checkOperationsException(aho, checkException)

    expect(mockedGenerateOperationsFromResults).toHaveBeenCalledWith(aho, isResubmitted, allResultsOnPnc)
  })

  it("checks for exceptions using generated operations", () => {
    const checkException = jest.fn()
    const aho = generateAhoFromOffenceList([])

    checkOperationsException(aho, checkException)

    expect(checkException).toHaveBeenCalledWith([{ code: PncOperation.REMAND }, { code: PncOperation.NORMAL_DISPOSAL }])
  })
})
