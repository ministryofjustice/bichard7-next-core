import type { Offence, Result } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import { matchOffences } from "./offenceMatcher"
import parsePncDate from "./parsePncDate"

const createHOOffence = (
  actOrSource: string,
  year: string,
  reason: string,
  startDate: string,
  endDate: string | null,
  resultCodes: string[]
): Offence => {
  const offence: Partial<Offence> = {
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: actOrSource,
          Year: year,
          Reason: reason,
          FullCode: `${actOrSource}${year}${reason}`
        }
      }
    },
    ActualOffenceStartDate: {
      StartDate: new Date(startDate)
    },
    Result: resultCodes.map(
      (code): Result => ({
        CJSresultCode: parseInt(code, 10),
        SourceOrganisation: {
          SecondLevelCode: "01",
          ThirdLevelCode: "OK",
          BottomLevelCode: "00",
          OrganisationUnitCode: "01OK00"
        },
        ResultQualifierVariable: [{ Code: "A" }]
      })
    )
  }

  if (endDate !== null) {
    offence.ActualOffenceEndDate = {
      EndDate: new Date(endDate)
    }
  }

  return offence as Offence
}

const createPNCCourtCaseOffence = (offenceCode: string, startDate: string, endDate: string): PncOffence => {
  const offence: PncOffence = {
    offence: {
      acpoOffenceCode: offenceCode,
      cjsOffenceCode: offenceCode,
      startDate: parsePncDate(startDate),
      sequenceNumber: 1
    }
  }

  if (endDate && endDate !== "") {
    offence.offence.endDate = parsePncDate(endDate)
  }

  return offence
}

describe("Offence Matcher", () => {
  it.skip("successfully match matching offences on PNC and HO", () => {
    const hoOffences: Offence[] = [
      createHOOffence("VG", "24", "030", "2009-09-08", null, ["1002"]),
      createHOOffence("VG", "24", "030", "2009-09-15", null, ["1002"]),
      createHOOffence("VG", "24", "030", "2009-09-22", null, ["1002"]),
      createHOOffence("VG", "24", "030", "2009-09-29", null, ["1002"])
    ]

    const pncOffences: PncOffence[] = [
      createPNCCourtCaseOffence("VG24030", "29092009", ""),
      createPNCCourtCaseOffence("VG24030", "22092009", ""),
      createPNCCourtCaseOffence("VG24030", "15092009", ""),
      createPNCCourtCaseOffence("VG24030", "08092009", "")
    ]

    const outcome = matchOffences(hoOffences, pncOffences, true)

    expect(outcome.allPncOffencesMatched).toBe(false)
    expect(outcome.duplicateHoOffences).toHaveLength(0)
    expect(outcome.matchedOffences).toHaveLength(4)

    outcome.matchedOffences.forEach((match) => {
      const hoOffenceIndex = hoOffences.indexOf(match.hoOffence)
      expect(match.pncOffence).toStrictEqual(pncOffences[3 - hoOffenceIndex])
    })
  })
})
