import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import offencesMatch from "./offencesMatch"

type MockOffenceOptions = {
  fullCode: string
  category?: string
  startDate: Date
  endDate?: Date
  dateCode?: number
  sequenceNumber?: number
}

const createMockHoOffence = ({
  fullCode,
  category = "XX",
  startDate,
  endDate,
  dateCode,
  sequenceNumber = 1
}: MockOffenceOptions): Offence =>
  ({
    CriminalProsecutionReference: {
      OffenceReason: {
        __type: "NationalOffenceReason",
        OffenceCode: {
          __type: "NonMatchingOffenceCode",
          ActOrSource: "",
          Reason: "",
          FullCode: fullCode
        }
      }
    },
    OffenceCategory: category,
    ActualOffenceStartDate: {
      StartDate: startDate
    },
    ActualOffenceEndDate: {
      EndDate: endDate
    },
    ActualOffenceDateCode: dateCode?.toString(),
    CourtOffenceSequenceNumber: sequenceNumber
  } as Offence)

const createMockPncOffence = ({ fullCode, startDate, endDate }: MockOffenceOptions): PncOffence =>
  ({
    offence: {
      cjsOffenceCode: fullCode,
      startDate,
      endDate
    }
  } as PncOffence)

describe("offencesMatch()", () => {
  const offenceDetails = {
    fullCode: "XYZ123",
    startDate: new Date("2022-03-31"),
    endDate: new Date("2022-04-01")
  }

  it("should say identical offences match", () => {
    const hoOffence = createMockHoOffence(offenceDetails)
    const pncOffence = createMockPncOffence(offenceDetails)

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(true)
  })

  it("not should say otherwise identical offences match if their sequence number differs and we are checking that", () => {
    const hoOffence = createMockHoOffence({ ...offenceDetails, sequenceNumber: 1 })
    const pncOffence = createMockPncOffence({ ...offenceDetails, sequenceNumber: 2 })

    const match1 = offencesMatch(hoOffence, pncOffence)
    expect(match1).toBe(true)

    const match2 = offencesMatch(hoOffence, pncOffence, { checkSequenceNumbers: true })
    expect(match2).toBe(false)
  })

  it("should say offences with different codes don't match", () => {
    const hoOffence = createMockHoOffence({ ...offenceDetails, fullCode: "XXX123" })
    const pncOffence = createMockPncOffence({ ...offenceDetails, fullCode: "YYY456" })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(false)
  })

  it("should say offences with different start dates don't match", () => {
    const hoOffence = createMockHoOffence({ ...offenceDetails })
    const pncOffence = createMockPncOffence({ ...offenceDetails, startDate: new Date("2022-04-28") })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(false)
  })

  it("should ignore different dates when comparing a breach offence", () => {
    const hoOffence = createMockHoOffence({ ...offenceDetails, category: "CB" })
    const pncOffence = createMockPncOffence({ ...offenceDetails, startDate: new Date("2022-04-28") })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(true)
  })

  it("should say offences match if start dates are equal and there's no PNC end date", () => {
    const hoOffence = createMockHoOffence({
      fullCode: "XYZ123",
      startDate: new Date("2022-03-31"),
      endDate: new Date("2022-03-31")
    })

    const pncOffence = createMockPncOffence({
      fullCode: "XYZ123",
      startDate: new Date("2022-03-31")
    })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(true)
  })

  it("should say offences match if start dates are equal, there's no HO end date and the HO date code is 1 or 5", () => {
    const hoOffence = createMockHoOffence({
      fullCode: "XYZ123",
      startDate: new Date("2022-03-31"),
      dateCode: 1
    })

    const pncOffence = createMockPncOffence({
      fullCode: "XYZ123",
      startDate: new Date("2022-03-31"),
      endDate: new Date("2022-03-31")
    })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(true)
  })

  it("should say offences don't match if start dates are equal, there's no HO end date and the HO date code is not 1 or 5", () => {
    const hoOffence = createMockHoOffence({
      fullCode: "XYZ123",
      startDate: new Date("2022-03-31"),
      dateCode: 2
    })

    const pncOffence = createMockPncOffence({
      fullCode: "XYZ123",
      startDate: new Date("2022-03-31"),
      endDate: new Date("2022-03-31")
    })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(false)
  })

  it("should say offences match if HO dates are within PNC dates", () => {
    const hoOffence = createMockHoOffence({
      ...offenceDetails,
      startDate: new Date("2022-03-27"),
      endDate: new Date("2022-03-30")
    })

    const pncOffence = createMockPncOffence({
      ...offenceDetails,
      startDate: new Date("2022-03-26"),
      endDate: new Date("2022-03-31")
    })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(true)
  })

  it("should say offences don't match if HO start date is before PNC start date", () => {
    const hoOffence = createMockHoOffence({
      ...offenceDetails,
      startDate: new Date("2022-03-25"),
      endDate: new Date("2022-03-30")
    })

    const pncOffence = createMockPncOffence({
      ...offenceDetails,
      startDate: new Date("2022-03-26"),
      endDate: new Date("2022-03-31")
    })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(false)
  })

  it("should say offences don't match if HO end date is after PNC end date", () => {
    const hoOffence = createMockHoOffence({
      ...offenceDetails,
      startDate: new Date("2022-03-27"),
      endDate: new Date("2022-04-01")
    })

    const pncOffence = createMockPncOffence({
      ...offenceDetails,
      startDate: new Date("2022-03-26"),
      endDate: new Date("2022-03-31")
    })

    const match = offencesMatch(hoOffence, pncOffence)

    expect(match).toBe(false)
  })
})
