import type { UserExceptionReportRow } from "@moj-bichard7/common/types/ExceptionReport"

import { processExceptions } from "./processExceptions"
import { processUsers } from "./processUsers"

jest.mock("./processExceptions")

describe("processUsers", () => {
  const mockProcessExceptions = processExceptions as jest.Mock

  beforeEach(() => {
    mockProcessExceptions.mockReset()
  })

  it("maps multiple users and their nested cases correctly", () => {
    const mockProcessedCase = { asn: "processed_case_dto" }

    mockProcessExceptions.mockReturnValue(mockProcessedCase)

    const inputData: UserExceptionReportRow[] = [
      {
        cases: [{ asn: "raw_case_1" } as any, { asn: "raw_case_2" } as any],
        username: "User 1"
      },
      {
        cases: [{ asn: "raw_case_3" } as any],
        username: "User 2"
      }
    ]

    const result = processUsers(inputData)

    expect(result).toHaveLength(2)

    expect(result[0].username).toBe("User 1")
    expect(result[0].cases).toHaveLength(2)
    expect(result[0].cases[0]).toEqual(mockProcessedCase)

    expect(result[1].username).toBe("User 2")
    expect(result[1].cases).toHaveLength(1)

    expect(mockProcessExceptions).toHaveBeenCalledTimes(3)
  })

  it("handles an empty list of users", () => {
    const result = processUsers([])
    expect(result).toEqual([])
  })

  it("handles a user with no cases", () => {
    const inputData: UserExceptionReportRow[] = [{ cases: [], username: "User Empty" }]

    const result = processUsers(inputData)

    expect(result).toHaveLength(1)
    expect(result[0].username).toBe("User Empty")
    expect(result[0].cases).toEqual([])
    expect(mockProcessExceptions).not.toHaveBeenCalled()
  })
})
