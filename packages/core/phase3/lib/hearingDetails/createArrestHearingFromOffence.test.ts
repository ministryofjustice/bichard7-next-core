import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { createArrestHearingFromOffence } from "./createArrestHearingFromOffence"

describe("createArrestHearingFromOffence", () => {
  const expectedArrestHearing = {
    committedOnBail: "Y",
    courtOffenceSequenceNumber: "001",
    locationOfOffence: "Some High Street",
    offenceEndDate: "16122024",
    offenceEndTime: "1500",
    offenceLocationFSCode: "05ZD",
    offenceReason: "11412HSD",
    offenceReasonSequence: "001",
    offenceStartDate: "10122024",
    offenceStartTime: "0900",
    type: "ARREST"
  }

  let offence: Offence
  let pncUpdateDataset: PncUpdateDataset

  beforeEach(() => {
    offence = {
      ActualOffenceStartDate: { StartDate: new Date("2024-12-10") },
      ActualOffenceEndDate: { EndDate: new Date("2024-12-16") },
      CommittedOnBail: "Y",
      CriminalProsecutionReference: {
        OffenceReason: {
          __type: "LocalOffenceReason",
          LocalOffenceCode: { OffenceCode: "11412HSD", AreaCode: "56" }
        },
        OffenceReasonSequence: "1"
      },
      LocationOfOffence: "Some High Street",
      OffenceTime: "09:00",
      OffenceEndTime: "15:00",
      Result: [{ PNCDisposalType: 1001, NumberOfOffencesTIC: 3, Verdict: "G", PleaStatus: "CON" }]
    } as Offence

    pncUpdateDataset = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Case: {
            HearingDefendant: {
              Offence: [offence]
            },
            ForceOwner: {
              SecondLevelCode: "05",
              ThirdLevelCode: "ZD"
            }
          }
        }
      }
    } as PncUpdateDataset
  })

  it("returns an arrest hearing from an offence", () => {
    const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

    expect(arrestHearing).toStrictEqual(expectedArrestHearing)
  })

  it("returns null and empty string for offence sequence fields when no offence reason sequence", () => {
    offence.CriminalProsecutionReference.OffenceReasonSequence = undefined

    const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

    expect(arrestHearing).toStrictEqual({
      ...expectedArrestHearing,
      courtOffenceSequenceNumber: null,
      offenceReasonSequence: ""
    })
  })

  it("returns an empty string for offence end date when no actual offence end date", () => {
    offence.ActualOffenceEndDate = undefined

    const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

    expect(arrestHearing).toStrictEqual({ ...expectedArrestHearing, offenceEndDate: "" })
  })

  it("returns 'N' for commited on bail when offence is not 'Y' for commited on bail", () => {
    offence.CommittedOnBail = "D"

    const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

    expect(arrestHearing).toStrictEqual({ ...expectedArrestHearing, committedOnBail: "N" })
  })

  it("returns the default offence location when no location of offence", () => {
    offence.LocationOfOffence = undefined

    const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

    expect(arrestHearing).toStrictEqual({ ...expectedArrestHearing, locationOfOffence: "Not provided by Court" })
  })

  it("returns an empty string for offence reason when no offence code", () => {
    offence.CriminalProsecutionReference.OffenceReason = undefined

    const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

    expect(arrestHearing).toStrictEqual({ ...expectedArrestHearing, offenceReason: "" })
  })

  describe("offence start and end time", () => {
    it("returns offence start time when no offence time", () => {
      offence.OffenceTime = undefined
      offence.StartTime = "15:30"

      const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

      expect(arrestHearing).toStrictEqual({ ...expectedArrestHearing, offenceStartTime: "1530" })
    })

    it("returns an empty string for offence times when no offence time, start time or end time", () => {
      offence.OffenceTime = undefined
      offence.StartTime = undefined
      offence.OffenceEndTime = undefined

      const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

      expect(arrestHearing).toStrictEqual({ ...expectedArrestHearing, offenceStartTime: "", offenceEndTime: "" })
    })

    it("adds padding at the beginning for offence times", () => {
      offence.OffenceTime = "9:45"
      offence.OffenceEndTime = "9:45"

      const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

      expect(arrestHearing).toStrictEqual({
        ...expectedArrestHearing,
        offenceStartTime: "0945",
        offenceEndTime: "0945"
      })
    })

    it("replaces midnight with one minute past midnight for offence times", () => {
      const midnight = "00:00"
      offence.OffenceTime = midnight
      offence.OffenceEndTime = midnight

      const arrestHearing = createArrestHearingFromOffence(pncUpdateDataset, offence)

      expect(arrestHearing).toStrictEqual({
        ...expectedArrestHearing,
        offenceStartTime: "0001",
        offenceEndTime: "0001"
      })
    })
  })
})
