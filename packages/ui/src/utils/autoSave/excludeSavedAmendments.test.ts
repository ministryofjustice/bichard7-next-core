import { AmendmentKeys, Amendments } from "types/Amendments"
import excludeSavedAmendments from "./excludeSavedAmendments"

describe("excludeSavedAmendments", () => {
  it("returns empty object given empty params", () => {
    const amendmentFields: AmendmentKeys[] = []
    const amendments: Amendments = {}
    const saveAmendments: Amendments = {}

    const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
    expect(result).toStrictEqual({})
  })

  describe(`when given "amendmentFields" value of AmendmentKeys type of string`, () => {
    const amendmentFields: AmendmentKeys[] = ["asn"]

    it("returns empty object with empty amendments and savedAmendments", () => {
      const amendments: Amendments = {}
      const saveAmendments: Amendments = {}

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({})
    })

    it("returns asn when present in the amendments and not in the savedAmendments", () => {
      const amendments: Amendments = { asn: "1101ZD0100000410836V" }
      const saveAmendments: Amendments = {}

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({ asn: "1101ZD0100000410836V" })
    })

    it("returns empty object when present in the amendments and in the savedAmendments", () => {
      const amendments: Amendments = { asn: "1101ZD0100000410836V" }
      const saveAmendments: Amendments = { asn: "1101ZD0100000410836V" }

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({})
    })

    it("returns asn when changed in the amendments and the old value is in the savedAmendments", () => {
      const amendments: Amendments = { asn: "1101ZD0100000448754K" }
      const saveAmendments: Amendments = { asn: "1101ZD0100000410836V" }

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({ asn: "1101ZD0100000448754K" })
    })
  })

  describe(`when given "amendmentFields" value of AmendmentKeys type of array`, () => {
    const amendmentFields: AmendmentKeys[] = ["nextSourceOrganisation"]

    it("returns empty object with empty amendments and savedAmendments", () => {
      const amendments: Amendments = {}
      const saveAmendments: Amendments = {}

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({})
    })

    it("returns nextSourceOrganisation when present in the amendments and not in the savedAmendments", () => {
      const amendments: Amendments = {
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
      }
      const saveAmendments: Amendments = {}

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
      })
    })

    it("returns empty object when present in the amendments and in the savedAmendments", () => {
      const amendments: Amendments = {
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
      }
      const saveAmendments: Amendments = {
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
      }

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({})
    })

    it("returns nextSourceOrganisation when changed in the amendments and the old value is in the savedAmendments", () => {
      const amendments: Amendments = {
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "C06BO00" }]
      }
      const saveAmendments: Amendments = {
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
      }

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "C06BO00" }]
      })
    })

    it("returns a nextSourceOrganisation when two values are given and one is new", () => {
      const amendments: Amendments = {
        nextSourceOrganisation: [
          { resultIndex: 0, offenceIndex: 0, value: "B21XA00" },
          { resultIndex: 0, offenceIndex: 1, value: "C06BO00" }
        ]
      }
      const saveAmendments: Amendments = {
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
      }

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({
        nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 1, value: "C06BO00" }]
      })
    })
  })

  describe(`with multiple "amendmentFields" (value of AmendmentKeys type of string and array)`, () => {
    let amendmentFields: AmendmentKeys[]

    beforeEach(() => {
      amendmentFields = ["asn", "nextSourceOrganisation"]
    })

    it("returns empty object with empty amendments and savedAmendments", () => {
      const amendments: Amendments = {}
      const saveAmendments: Amendments = {}

      const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
      expect(result).toStrictEqual({})
    })

    describe("given asn and nextSourceOrganisation", () => {
      it("with only amendments it returns asn and nextSourceOrganisation", () => {
        const amendments: Amendments = {
          asn: "1101ZD0100000410836V",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
        }
        const saveAmendments: Amendments = {}

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({
          asn: "1101ZD0100000410836V",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
        })
      })

      it("with amendments and the same savedAmendments it returns empty object", () => {
        const amendments: Amendments = {
          asn: "1101ZD0100000410836V",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
        }
        const saveAmendments: Amendments = {
          asn: "1101ZD0100000410836V",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
        }

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({})
      })

      it("with changed asn amendment and old asn value are in the savedAmendments it returns only the updates", () => {
        const amendments: Amendments = {
          asn: "1101ZD0100000448754K",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
        }
        const saveAmendments: Amendments = {
          asn: "1101ZD0100000410836V",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
        }

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({ asn: "1101ZD0100000448754K" })
      })

      it("with changed nextSourceOrganisation amendments and old nextSourceOrganisation value are in the savedAmendments it returns only the updates", () => {
        const amendments: Amendments = {
          asn: "1101ZD0100000410836V",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "C06BO00" }]
        }
        const saveAmendments: Amendments = {
          asn: "1101ZD0100000410836V",
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "B21XA00" }]
        }

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({
          nextSourceOrganisation: [{ resultIndex: 0, offenceIndex: 0, value: "C06BO00" }]
        })
      })
    })

    describe("given offenceReasonSequence and offenceCourtCaseReferenceNumber", () => {
      beforeEach(() => {
        amendmentFields = ["offenceReasonSequence", "offenceCourtCaseReferenceNumber"]
      })

      it("with only amendments it returns offenceReasonSequence and offenceCourtCaseReferenceNumber", () => {
        const amendments: Amendments = {
          offenceReasonSequence: [{ offenceIndex: 0, value: 1 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "97/1626/008395Q" }]
        }
        const saveAmendments: Amendments = {}

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({
          offenceReasonSequence: [{ offenceIndex: 0, value: 1 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "97/1626/008395Q" }]
        })
      })

      it("with amendments and savedAmendments it returns offenceReasonSequence and offenceCourtCaseReferenceNumber", () => {
        const amendments: Amendments = {
          offenceReasonSequence: [{ offenceIndex: 0, value: 1 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "" }]
        }
        const saveAmendments: Amendments = {
          offenceReasonSequence: [{ offenceIndex: 0, value: 1 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "97/1626/008395Q" }]
        }

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "" }]
        })
      })

      it("with amendments only it returns offenceReasonSequence and offenceCourtCaseReferenceNumber (Added in court)", () => {
        const amendments: Amendments = {
          offenceReasonSequence: [{ offenceIndex: 3, value: 0 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 3, value: "" }]
        }
        const saveAmendments: Amendments = {}

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({
          offenceReasonSequence: [{ offenceIndex: 3, value: 0 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 3, value: "" }]
        })
      })

      it("with amendments with savedAmendments it returns offenceReasonSequence and offenceCourtCaseReferenceNumber (Added in court)", () => {
        const amendments: Amendments = {
          offenceReasonSequence: [
            { offenceIndex: 3, value: 0 },
            { offenceIndex: 0, value: 1 }
          ],
          offenceCourtCaseReferenceNumber: [
            { offenceIndex: 3, value: "" },
            { offenceIndex: 0, value: "97/1626/008395Q" }
          ]
        }
        const saveAmendments: Amendments = {
          offenceReasonSequence: [{ offenceIndex: 3, value: 0 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 3, value: "" }]
        }

        const result = excludeSavedAmendments(amendmentFields, amendments, saveAmendments)
        expect(result).toStrictEqual({
          offenceReasonSequence: [{ offenceIndex: 0, value: 1 }],
          offenceCourtCaseReferenceNumber: [{ offenceIndex: 0, value: "97/1626/008395Q" }]
        })
      })
    })
  })
})
