import type { AnnotatedHearingOutcome } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import getExceptionMessage from "./getExceptionMessage"

describe("getExceptionMessage", () => {
  let courtCase: DisplayFullCourtCase

  beforeEach(() => {
    courtCase = {
      asn: "",
      courtName: "",
      errorId: 0,
      errorStatus: "Unresolved",
      errorReport: "",
      isUrgent: false,
      ptiurn: "",
      triggerCount: 0,
      defendantName: "",
      orgForPoliceFilter: null,
      courtCode: null,
      courtReference: "",
      notes: [],
      canUserEditExceptions: false,
      triggers: [],
      resolutionTimestamp: null,
      aho: {} as AnnotatedHearingOutcome,
      updatedHearingOutcome: {} as AnnotatedHearingOutcome
    }
  })

  it("returns undefined if there's no exceptions in the aho", () => {
    const result = getExceptionMessage(courtCase, 0)
    expect(result).toBeUndefined()
  })

  it("returns the exception message if there is exceptions in the aho and it's not present ErrorMessages file", () => {
    courtCase.aho = {
      Exceptions: [{ code: "HO100310", path: ["path", "to", 0, "offence"] }]
    } as AnnotatedHearingOutcome

    const result = getExceptionMessage(courtCase, 0)
    expect(result).toBe("Multiple court Offences with different Results match a PNC offence")
  })

  it("returns the exception message if there is exceptions in the aho and it's present ErrorMessages file", () => {
    courtCase.aho = {
      Exceptions: [{ code: "HO100507", path: ["path", "to", 0, "offence"] }]
    } as AnnotatedHearingOutcome

    const result = getExceptionMessage(courtCase, 0)
    expect(result).toBe(
      "Offences have been added in court to a Penalty case. This needs to be manually resolved on the PNC to deal with error, and then manually resolved in Bichard."
    )
  })

  it("returns undefined if the exception is resolved", () => {
    courtCase.errorStatus = "Resolved"
    courtCase.aho = {
      Exceptions: [{ code: "HO100310", path: ["path", "to", 0, "offence"] }]
    } as AnnotatedHearingOutcome

    const result = getExceptionMessage(courtCase, 0)
    expect(result).toBeUndefined()
  })

  it("returns undefined if the exception is not found", () => {
    courtCase.aho = {
      Exceptions: [{ code: "HO100110", path: ["path", "to", 0, "offence"] }]
    } as AnnotatedHearingOutcome

    const result = getExceptionMessage(courtCase, 0)
    expect(result).toBeUndefined()
  })

  it("returns undefined if the exception is not found with the offenceIndex begin changed", () => {
    courtCase.aho = {
      Exceptions: [{ code: "HO100110", path: ["path", "to", 0, "offence"] }]
    } as AnnotatedHearingOutcome

    const result = getExceptionMessage(courtCase, 1)
    expect(result).toBeUndefined()
  })
})
