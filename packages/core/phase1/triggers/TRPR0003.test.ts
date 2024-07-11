import generator from "./TRPR0003"
import generateAhoFromOffenceList from "../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import type { Offence } from "../../types/AnnotatedHearingOutcome"

describe("TRPR0003", () => {
  it("should return a trigger if an offence has result codes that exist in the mainResultCodes list", () => {
    const generatedHearingOutcome = generateAhoFromOffenceList([
      {
        Result: [
          {
            CJSresultCode: 1100
          }
        ],
        CriminalProsecutionReference: {
          OffenceReason: {
            __type: "NationalOffenceReason"
          }
        },
        CourtOffenceSequenceNumber: 1
      }
    ] as Offence[])

    expect(generator(generatedHearingOutcome)).toEqual([{ code: "TRPR0003", offenceSequenceNumber: 1 }])
  }),
    it("should return a trigger if an offence has result codes that exist in the yroResultCodes list and the yroSpeceficRequirementResultCodes list", () => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 1141
            },
            {
              CJSresultCode: 3104
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 2
        }
      ] as Offence[])
      expect(generator(generatedHearingOutcome)).toEqual([{ code: "TRPR0003", offenceSequenceNumber: 2 }])
    }),
    it("should not return a trigger if an offence has result codes that do not exist in the mainResultCodes list or the yroResultCodes list, but does exist in the yroSpeceficRequirementResultCodes list", () => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 1234
            },
            {
              CJSresultCode: 3104
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 2
        }
      ] as Offence[])
      expect(generator(generatedHearingOutcome)).toEqual([])
    }),
    it("should not return a trigger if an offence has result codes that do not exist in the mainResultCodes list or the yroSpeceficRequirementResultCodes list, but does exist in the yroResultCodes list", () => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 1142
            },
            {
              CJSresultCode: 1234
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 2
        }
      ] as Offence[])
      expect(generator(generatedHearingOutcome)).toEqual([])
    }),
    it("should return a single trigger if offence has multiple result codes that exist in mainResultCodes, yroResultCodes, and yroSpeceficRequirementResultCodes lists", () => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 3104
            },
            {
              CJSresultCode: 1142
            },
            {
              CJSresultCode: 1178
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 2
        }
      ] as Offence[])
      expect(generator(generatedHearingOutcome)).toEqual([{ code: "TRPR0003", offenceSequenceNumber: 2 }])
    }),
    it("should return multiple triggers when multiple offences have result codes that match the criteria", () => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 3041
            },
            {
              CJSresultCode: 1234
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 1
        },
        {
          Result: [
            {
              CJSresultCode: 1142
            },
            {
              CJSresultCode: 3104
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 2
        }
      ] as Offence[])
      expect(generator(generatedHearingOutcome)).toEqual([
        { code: "TRPR0003", offenceSequenceNumber: 1 },
        { code: "TRPR0003", offenceSequenceNumber: 2 }
      ])
    }),
    it("should return the correct number of triggers when multiple offences have result codes that both match and do not match the criteria", () => {
      const generatedHearingOutcome = generateAhoFromOffenceList([
        {
          Result: [
            {
              CJSresultCode: 3041
            },
            {
              CJSresultCode: 1234
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 1
        },
        {
          Result: [
            {
              CJSresultCode: 1142
            },
            {
              CJSresultCode: 3104
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 2
        },
        {
          Result: [
            {
              CJSresultCode: 1234
            }
          ],
          CriminalProsecutionReference: {
            OffenceReason: {
              __type: "NationalOffenceReason"
            }
          },
          CourtOffenceSequenceNumber: 1
        }
      ] as Offence[])
      expect(generator(generatedHearingOutcome)).toEqual([
        { code: "TRPR0003", offenceSequenceNumber: 1 },
        { code: "TRPR0003", offenceSequenceNumber: 2 }
      ])
    }),
    it("should not return a trigger if there is no offence", () => {
      const generatedHearingOutcome = generateAhoFromOffenceList([] as Offence[])
      expect(generator(generatedHearingOutcome)).toEqual([])
    })
})
