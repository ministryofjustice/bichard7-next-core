import { Amendments } from "types/Amendments"
import createDummyAho from "../../../test/helpers/createDummyAho"
import HO100102 from "../../../test/helpers/exceptions/HO100102"
import HO100206 from "../../../test/helpers/exceptions/HO100206"
import isAsnAmended from "./isAsnAmended"

describe("isAsnAmended", () => {
  const dummyAho = createDummyAho()
  dummyAho.Exceptions.length = 0
  HO100102(dummyAho)

  it("should return false when ASN editable field is empty and ASN exception is not raised", () => {
    const amendments: Amendments = {
      asn: ""
    }

    const result = isAsnAmended(dummyAho.Exceptions, amendments.asn)

    expect(result).toBe(false)
  })

  it("should return false when ASN editable field is empty and ASN exception is raised", () => {
    dummyAho.Exceptions.length = 0
    HO100206(dummyAho)

    const amendments: Amendments = {
      asn: ""
    }

    const result = isAsnAmended(dummyAho.Exceptions, amendments.asn)

    expect(result).toBe(false)
  })

  it("should return false if asn editable field has an invalid value entered", () => {
    const amendments: Amendments = {
      asn: "ABCDEF123456K"
    }

    const result = isAsnAmended(dummyAho.Exceptions, amendments.asn)

    expect(result).toBe(false)
  })

  it("should return true if a valid value is entered into the asn editable field", () => {
    const amendments: Amendments = {
      asn: "1101ZD0100000448754K"
    }

    const result = isAsnAmended(dummyAho.Exceptions, amendments.asn)

    expect(result).toBe(true)
  })
})
