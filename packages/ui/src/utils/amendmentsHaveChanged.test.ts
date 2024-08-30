import { DisplayFullCourtCase } from "types/display/CourtCases"
import createDummyAho from "../../test/helpers/createDummyAho"
import { HO100102, HO100206, HO100300 } from "../../test/helpers/exceptions"
import amendmentsHaveChanged from "./amendmentsHaveChanged"

describe("amendmentsHaveChanged", () => {
  const dummyAho = createDummyAho()

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("will return true if we have no amendments", () => {
    HO100300(dummyAho)
    const courtCase = {
      aho: dummyAho
    } as unknown as DisplayFullCourtCase

    const amendments = {}
    const result = amendmentsHaveChanged(courtCase, amendments)

    expect(result).toBe(true)
  })

  it("will return true if all amendments are valid and ASN is empty", () => {
    HO100102(dummyAho)
    const courtCase = {
      aho: dummyAho
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B01EF01"
        }
      ],
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2024-10-10"
        }
      ]
    }

    const result = amendmentsHaveChanged(courtCase, amendments)

    expect(result).toBe(true)
  })

  it("will return true if all amendments are valid and ASN is valid", () => {
    HO100102(dummyAho)
    HO100206(dummyAho)

    const courtCase = {
      aho: dummyAho
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "1101ZD0100000448754K",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B01EF01"
        }
      ],
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2024-10-10"
        }
      ]
    }

    const result = amendmentsHaveChanged(courtCase, amendments)

    expect(result).toBe(true)
  })

  it("will return true if all amendments are valid and ASN is invalid", () => {
    HO100102(dummyAho)
    HO100206(dummyAho)

    const courtCase = {
      aho: dummyAho
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "1101ZD0100000410836A",
      nextSourceOrganisation: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "B01EF01"
        }
      ],
      nextHearingDate: [
        {
          resultIndex: 0,
          offenceIndex: 1,
          value: "2024-10-10"
        }
      ]
    }

    const result = amendmentsHaveChanged(courtCase, amendments)

    expect(result).toBe(true)
  })

  it("will return true if an amendment is invalid", () => {
    HO100206(dummyAho)
    const courtCase = {
      aho: dummyAho
    } as unknown as DisplayFullCourtCase

    const amendments = {
      asn: "1101ZD0100000410836A"
    }

    const result = amendmentsHaveChanged(courtCase, amendments)

    expect(result).toBe(true)
  })
})
