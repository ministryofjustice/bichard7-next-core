import { Amendments } from "types/Amendments"
import createDummyAho from "../../../test/helpers/createDummyAho"
import { HO100323 } from "../../../test/helpers/exceptions"
import HO100300 from "../../../test/helpers/exceptions/HO100300"
import HO100322 from "../../../test/helpers/exceptions/HO100322"
import isNextHearingLocationAmended from "./isNextHearingLocationAmended"

describe("isNextHearingLocationAmended", () => {
  const dummyAho = createDummyAho()

  it("should return false if next hearing location editable field is empty", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: ""
        }
      ]
    }
    const result = isNextHearingLocationAmended(dummyAho.Exceptions, amendments.nextSourceOrganisation)

    expect(result).toBe(false)
  })

  it("should return true if a value is entered into the next hearing date editable field", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        }
      ]
    }
    const result = isNextHearingLocationAmended(dummyAho.Exceptions, amendments.nextSourceOrganisation)

    expect(result).toBe(true)
  })

  it("should return true if one of the next hearing location editable fields remained empty", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)
    HO100322(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: ""
        }
      ]
    }
    const result = isNextHearingLocationAmended(dummyAho.Exceptions, amendments.nextSourceOrganisation)

    expect(result).toBe(true)
  })

  it("should return true if multiple hearing location editable fields have values", () => {
    dummyAho.Exceptions.length = 0
    HO100300(dummyAho)
    HO100322(dummyAho)

    const amendments: Amendments = {
      asn: "1101ZD0100000448754K",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA00"
        },
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B21XA11"
        }
      ]
    }
    const result = isNextHearingLocationAmended(dummyAho.Exceptions, amendments.nextSourceOrganisation)

    expect(result).toBe(true)
  })

  it("should return false if next hearing location exceptions are not raised", () => {
    dummyAho.Exceptions.length = 0
    HO100323(dummyAho)

    const amendments: Amendments = {}
    const result = isNextHearingLocationAmended(dummyAho.Exceptions, amendments.nextSourceOrganisation)

    expect(result).toBe(false)
  })
})
