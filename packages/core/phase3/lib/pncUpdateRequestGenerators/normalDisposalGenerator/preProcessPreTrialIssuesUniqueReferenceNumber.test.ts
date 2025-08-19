import type { Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import ResultClass from "@moj-bichard7/common/types/ResultClass"

import preProcessPreTrialIssuesUniqueReferenceNumber from "./preProcessPreTrialIssuesUniqueReferenceNumber"

describe("preProcessPreTrialIssuesUniqueReferenceNumber", () => {
  const courtCaseReference = "123"

  describe("when case requires RCC and has reportable offences", () => {
    const offences = [
      {
        AddedByTheCourt: true,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: courtCaseReference,
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      }
    ] as Offence[]

    it("should use force owner to generate PTIURN when force owner length is 6 characters and PTIURN has value", () => {
      const result = preProcessPreTrialIssuesUniqueReferenceNumber(
        offences,
        courtCaseReference,
        "02ZD03032082384750192834",
        "01ZD00"
      )

      expect(result).toBe("01ZD/03032082384750")
    })

    it("should use force owner to generate PTIURN when force owner length is 6 characters and PTIURN is undefined", () => {
      const result = preProcessPreTrialIssuesUniqueReferenceNumber(offences, courtCaseReference, undefined, "01ZD00")

      expect(result).toBe("01ZD/")
    })

    it("should use the passed PTIURN to generate PTIURN when force owner length is not 6 characters and PTIURN has value", () => {
      const result = preProcessPreTrialIssuesUniqueReferenceNumber(
        offences,
        courtCaseReference,
        "02ZD03032082384750192834",
        "01ZD"
      )

      expect(result).toBe("02ZD/03032082384750")
    })

    it("should return 4 whitespaces and a forward-slash when force owner length is not 6 characters and PTIURN is empty string", () => {
      const result = preProcessPreTrialIssuesUniqueReferenceNumber(offences, courtCaseReference, "", "01ZD")

      expect(result).toBe("    /")
    })

    it("should return 4 whitespaces and a forward-slash when force owner length is not 6 characters and PTIURN is undefined", () => {
      const result = preProcessPreTrialIssuesUniqueReferenceNumber(offences, courtCaseReference, undefined, "01ZD")

      expect(result).toBe("    /")
    })

    it("should return 4 whitespaces and a forward-slash when force owner and PTIURN are undefined", () => {
      const result = preProcessPreTrialIssuesUniqueReferenceNumber(offences, courtCaseReference, undefined, "01ZD")

      expect(result).toBe("    /")
    })
  })

  it("returns null when case does not require RCC", () => {
    const offences = [
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "B7",
        CourtCaseReferenceNumber: courtCaseReference,
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      }
    ] as Offence[]

    const result = preProcessPreTrialIssuesUniqueReferenceNumber(
      offences,
      courtCaseReference,
      "02ZD03032082384750192834",
      "01ZD00"
    )

    expect(result).toBeNull()
  })

  it("returns null when case requires RCC but no reportable offences", () => {
    const offences = [
      {
        AddedByTheCourt: false,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060 } as unknown as Result]
      },
      {
        AddedByTheCourt: true,
        CriminalProsecutionReference: {
          OffenceReasonSequence: undefined
        },
        OffenceCategory: "ZZ",
        CourtCaseReferenceNumber: "123",
        Result: [{ PNCDisposalType: 2060, ResultClass: ResultClass.SENTENCE } as unknown as Result]
      }
    ] as Offence[]

    const result = preProcessPreTrialIssuesUniqueReferenceNumber(
      offences,
      courtCaseReference,
      "02ZD03032082384750192834",
      "01ZD00"
    )

    expect(result).toBeNull()
  })
})
