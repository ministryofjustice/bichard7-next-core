import type { DisplayPartialCourtCase } from "../types/display/CourtCases"

import getResolutionStatus from "./getResolutionStatus"

describe("getResolutionStatus", () => {
  it.each([
    { errorStatus: "Submitted", expectedResolutionStatus: "Submitted", resolutionTimestamp: null },
    { errorStatus: "Resolved", expectedResolutionStatus: "Resolved", resolutionTimestamp: new Date() },
    { errorStatus: null, expectedResolutionStatus: "Resolved", resolutionTimestamp: new Date() },
    { errorStatus: null, expectedResolutionStatus: "Unresolved", resolutionTimestamp: null },
    { errorStatus: "Resolved", expectedResolutionStatus: "Unresolved", resolutionTimestamp: null }
  ])(
    "generates resolution status $expectedResolutionStatus when resolutionTimestamp is $resolutionTimestamp and errorStatus is $errorStatus",
    (test) => {
      const courtCase = {
        errorStatus: test.errorStatus,
        resolutionTimestamp: test.resolutionTimestamp
      } as unknown as DisplayPartialCourtCase
      expect(getResolutionStatus(courtCase)).toEqual(test.expectedResolutionStatus)
    }
  )
})
