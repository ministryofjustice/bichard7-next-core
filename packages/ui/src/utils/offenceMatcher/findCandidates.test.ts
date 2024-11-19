import type { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import type { PncOffence } from "@moj-bichard7/core/types/PncQueryResult"

import type { DisplayFullCourtCase } from "../../types/display/CourtCases"
import type { Candidates } from "../../types/OffenceMatching"

import HO100310 from "../../../cypress/fixtures/HO100310.json"
import HO100332 from "../../../cypress/fixtures/HO100332.json"
import parseCourtCaseWithDateObjects from "../date/parseCourtCaseWithDateObjects"
import findCandidates from "./findCandidates"

describe("findCandidates", () => {
  const caseReference = "case-reference"
  const offenceIndex = 0

  describe("when there aren't any matches", () => {
    it("should return an empty offences array if offence codes do not match", () => {
      const pncOffence = { offence: { cjsOffenceCode: "nonMatchingOffenceCode" } } as PncOffence
      const offence = {
        CriminalProsecutionReference: {
          OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
        }
      } as Offence
      const courtCase = {
        aho: {
          AnnotatedHearingOutcome: {
            HearingOutcome: {
              Case: {
                HearingDefendant: { Offence: [offence] }
              },
              Hearing: { DateOfHearing: new Date() }
            }
          },
          PncQuery: {
            courtCases: [
              {
                courtCaseReference: "caseReference-1",
                offences: [pncOffence]
              },
              {
                courtCaseReference: "caseReference-2",
                offences: [pncOffence]
              }
            ]
          }
        }
      } as DisplayFullCourtCase

      expect(findCandidates(courtCase, offenceIndex)).toHaveLength(0)
    })

    it("should return an empty offences array if offence codes match but dates do not match", () => {
      const pncOffence = { offence: { cjsOffenceCode: "offenceCode", startDate: new Date("1990-01-01") } } as PncOffence
      const offence = {
        ActualOffenceStartDate: { StartDate: new Date("1990-02-01") },
        CriminalProsecutionReference: {
          OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
        }
      } as Offence
      const courtCase = {
        aho: {
          AnnotatedHearingOutcome: {
            HearingOutcome: {
              Case: {
                HearingDefendant: { Offence: [offence] }
              },
              Hearing: { DateOfHearing: new Date() }
            }
          },
          PncQuery: {
            courtCases: [
              {
                courtCaseReference: caseReference,
                offences: [pncOffence]
              }
            ]
          }
        }
      } as DisplayFullCourtCase

      expect(findCandidates(courtCase, offenceIndex)).toHaveLength(0)
    })
  })

  describe("when there is one matching offence", () => {
    it("should return the matching offence if both offence codes and dates match", () => {
      const pncOffence = { offence: { cjsOffenceCode: "offenceCode", startDate: new Date("1990-01-01") } } as PncOffence
      const offence = {
        ActualOffenceStartDate: { StartDate: new Date("1990-01-01") },
        CriminalProsecutionReference: {
          OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
        }
      } as Offence

      const courtCase = {
        aho: {
          AnnotatedHearingOutcome: {
            HearingOutcome: {
              Case: {
                HearingDefendant: { Offence: [offence] }
              },
              Hearing: { DateOfHearing: new Date() }
            }
          },
          PncQuery: {
            courtCases: [
              {
                courtCaseReference: caseReference,
                offences: [pncOffence]
              }
            ]
          }
        }
      } as DisplayFullCourtCase

      const result = findCandidates(courtCase, offenceIndex)

      expect(result).toHaveLength(1)
      expect((result as Candidates[])[0].courtCaseReference).toEqual(caseReference)
      expect((result as Candidates[])[0].offences[0].offence.cjsOffenceCode).toBe("offenceCode")
    })

    it("should return the matching offence grouped by court case reference", () => {
      const courtCase = parseCourtCaseWithDateObjects(HO100310 as unknown as DisplayFullCourtCase)
      const result = findCandidates(courtCase, offenceIndex)

      expect(result).toHaveLength(1)
      expect(result as Candidates[]).toStrictEqual([
        {
          courtCaseReference: "97/1626/008395Q",
          offences: [
            {
              offence: {
                acpoOffenceCode: "12:15:24:1",
                cjsOffenceCode: "TH68006",
                endDate: new Date("2010-12-05T00:00:00.000Z"),
                endTime: "00:00",
                qualifier1: "",
                qualifier2: "",
                sequenceNumber: 1,
                startDate: new Date("2010-11-28T00:00:00.000Z"),
                startTime: "00:00",
                title: "Theft of pedal cycle"
              }
            }
          ]
        }
      ])
    })
  })

  describe("When there are multiple matches", () => {
    it("should return both matching offences when the matches are on the same court case", () => {
      const pncOffence = { offence: { cjsOffenceCode: "offenceCode", startDate: new Date("1990-01-01") } } as PncOffence
      const offence = {
        ActualOffenceStartDate: { StartDate: new Date("1990-01-01") },
        CriminalProsecutionReference: {
          OffenceReason: { __type: "NationalOffenceReason", OffenceCode: { FullCode: "offenceCode" } }
        }
      } as Offence

      const courtCase = {
        aho: {
          AnnotatedHearingOutcome: {
            HearingOutcome: {
              Case: {
                HearingDefendant: { Offence: [offence] }
              },
              Hearing: { DateOfHearing: new Date() }
            }
          },
          PncQuery: {
            courtCases: [
              {
                courtCaseReference: "court case ref with two matching offences",
                offences: [pncOffence, pncOffence]
              }
            ]
          }
        }
      } as DisplayFullCourtCase

      const result = findCandidates(courtCase, offenceIndex)

      expect(result).toHaveLength(1)
      expect(result as Candidates[]).toStrictEqual([
        {
          courtCaseReference: "court case ref with two matching offences",
          offences: [pncOffence, pncOffence]
        }
      ])
    })

    it("should return both matching offences when the matches are on two different court cases", () => {
      const courtCase = parseCourtCaseWithDateObjects(HO100332 as unknown as DisplayFullCourtCase)
      const result = findCandidates(courtCase, offenceIndex)

      expect(result).toHaveLength(2)
      expect(result as Candidates[]).toStrictEqual([
        {
          courtCaseReference: "12/2732/000015R",
          offences: [
            {
              offence: {
                acpoOffenceCode: "1:9:7:1",
                cjsOffenceCode: "OF61016",
                qualifier1: "",
                qualifier2: "",
                sequenceNumber: 1,
                startDate: new Date("2009-06-01T00:00:00.000Z"),
                title: "Section 18 - wounding with intent"
              }
            }
          ]
        },
        {
          courtCaseReference: "12/2732/000016T",
          offences: [
            {
              offence: {
                acpoOffenceCode: "1:9:7:1",
                cjsOffenceCode: "OF61016",
                qualifier1: "",
                qualifier2: "",
                sequenceNumber: 2,
                startDate: new Date("2009-06-01T00:00:00.000Z"),
                title: "Section 18 - wounding with intent"
              }
            }
          ]
        }
      ])
    })
  })
})
