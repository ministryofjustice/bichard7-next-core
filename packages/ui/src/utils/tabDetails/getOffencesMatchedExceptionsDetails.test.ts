import type { Amendments } from "types/Amendments"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import createDummyAho from "../../../test/helpers/createDummyAho"
import { HO100206, HO100310 } from "../../../test/helpers/exceptions"
import getOffencesMatchedExceptionsDetails from "./getOffencesMatchedExceptionsDetails"

const dummyAho = createDummyAho()

describe("getOffencesMatchedExceptionsDetails", () => {
  it.each([[HO100310]])(
    "Should return ExceptionsCount:2, ExceptionsResolved:false when either of offence matching exception is raised",
    (offenceMatchingException) => {
      dummyAho.Exceptions.length = 0
      offenceMatchingException(dummyAho)
      offenceMatchingException(dummyAho)

      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedAmendments = {} as Amendments

      const offenceMatchingExceptions = getOffencesMatchedExceptionsDetails(courtCase.aho.Exceptions, updatedAmendments)

      expect(offenceMatchingExceptions.ExceptionsCount).toBe(2)
      expect(offenceMatchingExceptions.ExceptionsResolved).toBe(false)
    }
  )

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when a offence matching exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100310(dummyAho)
    HO100310(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedAmendments = {
      offenceReasonSequence: [
        {
          offenceIndex: 0,
          value: 1
        },
        {
          offenceIndex: 3,
          value: 0
        }
      ]
    } as Amendments

    const offenceMatchingExceptions = getOffencesMatchedExceptionsDetails(courtCase.aho.Exceptions, updatedAmendments)

    expect(offenceMatchingExceptions.ExceptionsCount).toBe(0)
    expect(offenceMatchingExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:false when no offence matching exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedAmendments = {} as Amendments

    const offenceMatchingExceptions = getOffencesMatchedExceptionsDetails(courtCase.aho.Exceptions, updatedAmendments)

    expect(offenceMatchingExceptions.ExceptionsCount).toBe(0)
    expect(offenceMatchingExceptions.ExceptionsResolved).toBe(false)
  })
})
