import type { Amendments } from "types/Amendments"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import createDummyAho from "../../../test/helpers/createDummyAho"
import { HO100310 } from "../../../test/helpers/exceptions"
import HO100102 from "../../../test/helpers/exceptions/HO100102"
import HO100200 from "../../../test/helpers/exceptions/HO100200"
import HO100206 from "../../../test/helpers/exceptions/HO100206"
import HO100300 from "../../../test/helpers/exceptions/HO100300"
import HO100305 from "../../../test/helpers/exceptions/HO100305"
import HO100322 from "../../../test/helpers/exceptions/HO100322"
import HO100323 from "../../../test/helpers/exceptions/HO100323"
import getTabDetails from "./getTabDetails"

const dummyAho = createDummyAho()

describe("getTabDetails", () => {
  it.each([
    ["Defendant", 1, "asn", [HO100206], 0],
    ["Offences", 1, "next-hearing-date", [HO100102], 3],
    ["Offences", 2, "next-hearing-date", [HO100102, HO100323], 3],
    ["Offences", 1, "next-hearing-location", [HO100200], 3],
    ["Offences", 2, "next-hearing-location", [HO100200, HO100300], 3],
    ["Offences", 3, "next-hearing-location", [HO100200, HO100300, HO100322], 3],
    ["Offences", 4, "next-hearing-date and next-hearing-location", [HO100200, HO100300, HO100322, HO100102], 3]
  ])(
    "Should return %s as a tab and %s as exceptionCount when %s exception(s) are raised",
    (tabName: string, exceptionsCount: number, typeOfException: string, exceptions, index: number) => {
      const exceptionType = typeOfException
      dummyAho.Exceptions.length = 0
      exceptions.map((exception) => exception(dummyAho))
      const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
      const updatedFields = {} as Amendments
      const savedAmendments = {} as Amendments

      const tabDetails = getTabDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

      expect(tabDetails[index].name).toBe(tabName)
      expect(tabDetails[index].exceptionsCount).toBe(exceptionsCount)
      expect(exceptionType).toBe(typeOfException)
    }
  )

  it("Should return isResolved:true for offences tab when next-hearing-date exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const amendments = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments
    const updatedFields = amendments
    const savedAmendments = amendments

    const tabDetails = getTabDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

    expect(tabDetails[3].name).toBe("Offences")
    expect(tabDetails[3].exceptionsCount).toBe(0)
    expect(tabDetails[3].exceptionsResolved).toBe(true)
  })

  it("Should return isResolved:false for offences tab when multiple exceptions are raised and only one of them is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100200(dummyAho)
    HO100310(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const amendments = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ]
    } as Amendments
    const updatedFields = amendments
    const savedAmendments = amendments

    const tabDetails = getTabDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

    expect(tabDetails[3].name).toBe("Offences")
    expect(tabDetails[3].exceptionsCount).toBe(2)
    expect(tabDetails[3].exceptionsResolved).toBe(false)
  })

  it("Should return isResolved:true for offences tab when multiple exceptions are raised and all of them are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100200(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const amendments = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ],
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    } as Amendments
    const updatedFields = amendments
    const savedAmendments = amendments

    const tabDetails = getTabDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

    expect(tabDetails[3].name).toBe("Offences")
    expect(tabDetails[3].exceptionsCount).toBe(0)
    expect(tabDetails[3].exceptionsResolved).toBe(true)
  })

  it("Should return isResolved:false for offences tab when multiple exceptions are raised and all of them are resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    HO100200(dummyAho)
    HO100305(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const amendments = {
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 0,
          value: "2002-10-10"
        }
      ],
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    } as Amendments
    const updatedFields = amendments
    const savedAmendments = amendments

    const tabDetails = getTabDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

    expect(tabDetails[3].name).toBe("Offences")
    expect(tabDetails[3].exceptionsCount).toBe(1)
    expect(tabDetails[3].exceptionsResolved).toBe(false)
  })
})
