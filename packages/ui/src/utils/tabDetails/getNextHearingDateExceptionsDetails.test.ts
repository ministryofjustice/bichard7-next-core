import type { Amendments } from "types/Amendments"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import createDummyAho from "../../../test/helpers/createDummyAho"
import { HO100102, HO100206, HO100323 } from "../../../test/helpers/exceptions"
import getNextHearingDateExceptionsDetails from "./getNextHearingDateExceptionsDetails"

const dummyAho = createDummyAho()

describe("getNextHearingDateExceptionsDetails", () => {
  it("Should return ExceptionsCount:1, ExceptionsResolved:false when HO100102 is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {} as Amendments

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, savedAmendments)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(1)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:2, ExceptionsResolved:false when HO100102 and HO100323 are raised", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100323(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {} as Amendments

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, savedAmendments)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(2)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when a next-hearing-date exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, savedAmendments)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when multiple next-hearing-date exceptions are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100323(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2025-10-10"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2026-10-10"
        }
      ]
    } as Amendments

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, savedAmendments)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:false when next-hearing-date exception is not raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const savedAmendments = {} as Amendments

    const nextHearingDateExceptions = getNextHearingDateExceptionsDetails(courtCase.aho.Exceptions, savedAmendments)

    expect(nextHearingDateExceptions.ExceptionsCount).toBe(0)
    expect(nextHearingDateExceptions.ExceptionsResolved).toBe(false)
  })
})
