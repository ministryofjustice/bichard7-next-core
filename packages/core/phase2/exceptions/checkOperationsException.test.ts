import checkOperationsException from "./checkOperationsException"
import generateAhoFromOffenceList from "../tests/fixtures/helpers/generateAhoFromOffenceList"
import { generateOperationsFromOffenceResults } from "../lib/generateOperations/generateOperations"
import { PncOperation } from "../../types/PncOperation"

jest.mock("../lib/generateOperations/generateOperations")

const mockedGenerateOperationsFromOffenceResults = generateOperationsFromOffenceResults as jest.Mock

mockedGenerateOperationsFromOffenceResults.mockReturnValue([
  { code: PncOperation.REMAND },
  { code: PncOperation.NORMAL_DISPOSAL }
])

describe("checkOperationsException", () => {
  it("generates operations from results", () => {
    const checkException = jest.fn()
    const aho = generateAhoFromOffenceList([])
    const allResultsOnPnc = false
    const isResubmitted = false

    checkOperationsException(aho, checkException)

    expect(mockedGenerateOperationsFromOffenceResults).toHaveBeenCalledWith(aho, allResultsOnPnc, isResubmitted)
  })

  it("checks for exceptions using generated operations", () => {
    const checkException = jest.fn()
    const aho = generateAhoFromOffenceList([])

    checkOperationsException(aho, checkException)

    expect(checkException).toHaveBeenCalledWith([{ code: PncOperation.REMAND }, { code: PncOperation.NORMAL_DISPOSAL }])
  })
})
