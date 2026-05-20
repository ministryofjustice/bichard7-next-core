import type { UserExceptionReportRow } from "../../../../types/reports/Exceptions"

import { CASE_TYPES } from "../../../../types/reports/Exceptions"
import { processExceptions } from "./processExceptions"
import { processUsers } from "./processUsers"

jest.mock("./processExceptions")

const mockedProcessExceptions = jest.mocked(processExceptions)

describe("processUsers", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should return an empty array when provided with an empty array of users", () => {
    const result = processUsers([])

    expect(result).toEqual([])
    expect(mockedProcessExceptions).not.toHaveBeenCalled()
  })

  it("should correctly process a user with no cases", () => {
    const input: UserExceptionReportRow[] = [
      {
        cases: [],
        username: "user.without.cases"
      } as unknown as UserExceptionReportRow
    ]

    const result = processUsers(input)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      cases: [],
      totals: {
        exceptions: 0,
        total: 0,
        triggers: 0
      },
      username: "user.without.cases"
    })
    expect(mockedProcessExceptions).not.toHaveBeenCalled()
  })

  it("should correctly calculate totals and map processed cases for a single user", () => {
    const mockProcessedCase1 = { processedId: "1" }
    const mockProcessedCase2 = { processedId: "2" }
    const mockProcessedCase3 = { processedId: "3" }
    const mockProcessedCase4 = { processedId: "4" }

    mockedProcessExceptions
      .mockReturnValueOnce(mockProcessedCase1 as any)
      .mockReturnValueOnce(mockProcessedCase2 as any)
      .mockReturnValueOnce(mockProcessedCase3 as any)
      .mockReturnValueOnce(mockProcessedCase4 as any)

    const input: UserExceptionReportRow[] = [
      {
        cases: [
          { id: 1, type: CASE_TYPES.Exception },
          { id: 2, type: CASE_TYPES.Trigger },
          { id: 3, type: CASE_TYPES.Exception },
          { id: 4, type: "OTHER_TYPE" }
        ],
        username: "johndoe"
      } as unknown as UserExceptionReportRow
    ]

    const result = processUsers(input)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      cases: [mockProcessedCase1, mockProcessedCase2, mockProcessedCase3, mockProcessedCase4],
      totals: {
        exceptions: 2,
        total: 4,
        triggers: 1
      },
      username: "johndoe"
    })

    expect(mockedProcessExceptions).toHaveBeenCalledTimes(4)
    expect(mockedProcessExceptions).toHaveBeenNthCalledWith(1, input[0].cases[0])
    expect(mockedProcessExceptions).toHaveBeenNthCalledWith(2, input[0].cases[1])
  })

  it("should correctly process multiple users", () => {
    const mockProcessedCase = { processed: true }
    mockedProcessExceptions.mockReturnValue(mockProcessedCase as any)

    const input: UserExceptionReportRow[] = [
      {
        cases: [{ type: CASE_TYPES.Exception }],
        username: "user.one"
      } as unknown as UserExceptionReportRow,
      {
        cases: [{ type: CASE_TYPES.Trigger }, { type: CASE_TYPES.Trigger }],
        username: "user.two"
      } as unknown as UserExceptionReportRow
    ]

    const result = processUsers(input)

    expect(result).toHaveLength(2)

    expect(result[0]).toEqual(
      expect.objectContaining({
        cases: [mockProcessedCase],
        totals: { exceptions: 1, total: 1, triggers: 0 },
        username: "user.one"
      })
    )

    expect(result[1]).toEqual(
      expect.objectContaining({
        cases: [mockProcessedCase, mockProcessedCase],
        totals: { exceptions: 0, total: 2, triggers: 2 },
        username: "user.two"
      })
    )

    expect(mockedProcessExceptions).toHaveBeenCalledTimes(3)
  })
})
