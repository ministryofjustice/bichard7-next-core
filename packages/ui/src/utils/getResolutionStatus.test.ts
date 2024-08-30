import { DisplayPartialCourtCase } from "../types/display/CourtCases"
import getResolutionStatus from "./getResolutionStatus"

describe("getResolutionStatus", () => {
  it.each([
    { errorStatus: "Submitted", resolutionTimestamp: null, expectedResolutionStatus: "Submitted" },
    { errorStatus: "Resolved", resolutionTimestamp: new Date(), expectedResolutionStatus: "Resolved" },
    { errorStatus: null, resolutionTimestamp: new Date(), expectedResolutionStatus: "Resolved" },
    { errorStatus: null, resolutionTimestamp: null, expectedResolutionStatus: "Unresolved" },
    { errorStatus: "Resolved", resolutionTimestamp: null, expectedResolutionStatus: "Unresolved" }
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
