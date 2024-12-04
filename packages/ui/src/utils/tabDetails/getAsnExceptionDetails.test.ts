import type { Amendments } from "types/Amendments"
import type { DisplayFullCourtCase } from "types/display/CourtCases"
import createDummyAho from "../../../test/helpers/createDummyAho"
import { HO100102, HO100206, HO100321 } from "../../../test/helpers/exceptions"
import getAsnExceptionDetails from "./getAsnExceptionDetails"

const dummyAho = createDummyAho()

describe("getAsnExceptionDetails", () => {
  it("Should return ExceptionsCount:1, ExceptionsResolved:false when ASN exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as Amendments
    const savedAmendments = {} as Amendments

    const asnException = getAsnExceptionDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

    expect(asnException.ExceptionsCount).toBe(1)
    expect(asnException.ExceptionsResolved).toBe(false)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:true when ASN exception is resolved", () => {
    dummyAho.Exceptions.length = 0
    HO100321(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {
      asn: "1101ZD0100000448754K"
    } as Amendments
    const savedAmendments = {
      asn: "1101ZD0100000448754K"
    } as Amendments

    const asnException = getAsnExceptionDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

    expect(asnException.ExceptionsCount).toBe(0)
    expect(asnException.ExceptionsResolved).toBe(true)
  })

  it("Should return ExceptionsCount:0, ExceptionsResolved:false when ASN exception is not raised", () => {
    dummyAho.Exceptions.length = 0
    HO100102(dummyAho)
    const courtCase = { aho: dummyAho } as unknown as DisplayFullCourtCase
    const updatedFields = {} as Amendments
    const savedAmendments = {} as Amendments

    const asnException = getAsnExceptionDetails(courtCase.aho.Exceptions, updatedFields, savedAmendments)

    expect(asnException.ExceptionsCount).toBe(0)
    expect(asnException.ExceptionsResolved).toBe(false)
  })
})
