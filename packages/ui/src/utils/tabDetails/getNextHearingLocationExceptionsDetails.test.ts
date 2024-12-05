import type { Amendments } from "types/Amendments"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import createDummyAho from "../../../test/helpers/createDummyAho"
import { HO100200, HO100206, HO100300, HO100322 } from "../../../test/helpers/exceptions"
import getNextHearingLocationExceptionsDetails from "./getNextHearingLocationExceptionsDetails"

const dummyAho = createDummyAho()

describe("getNextHearingLocationExceptionsDetails", () => {
  it.each([[HO100200], [HO100300], [HO100322]])(
    "Should return ExceptionsCount:1, ExceptionsResolved:false when either of next-hearing-location exception is raised",
    (nextHearingLocationException) => {
      dummyAho.Exceptions.length = 0
      nextHearingLocationException(dummyAho)
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const savedAmendments = {} as Amendments

      const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
        courtCase.aho.Exceptions,
        savedAmendments
      )

      expect(nextHearingLocationExceptions.ExceptionsCount).toBe(1)
      expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
    }
  )

  it("Should return ExceptionsCount:2, ExceptionsResolved:false when HO100200 and HO100300 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {} as Amendments

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      savedAmendments
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(2)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:3, ExceptionsResolved:false when HO100200, HO100300 and HO100322 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    HO100322(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {} as Amendments

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      savedAmendments
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(3)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when a next-hearing-location exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    } as Amendments

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      savedAmendments
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when multiple next-hearing-location exceptions are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100200(dummyAho)
    HO100300(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        },
        {
          resultIndex: 1,
          offenceIndex: 2,
          value: "B21XA11"
        }
      ]
    } as Amendments

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      savedAmendments
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:false when no next-hearing-location exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {} as Amendments

    const nextHearingLocationExceptions = getNextHearingLocationExceptionsDetails(
      courtCase.aho.Exceptions,
      savedAmendments
    )

    expect(nextHearingLocationExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingLocationExceptions.ExceptionsResolved).toBe(false)
  })
})
