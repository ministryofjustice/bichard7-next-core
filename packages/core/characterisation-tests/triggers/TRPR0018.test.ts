import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"
import type { ResultedCaseMessageParsedXml } from "../types/IncomingMessage"

const code = TriggerCode.TRPR0018
const resultCode = 1015

type PncOffenceDateOverride = {
  startDate: string
  endDate?: string
}

const pncOffenceDateOverrides = (dates: PncOffenceDateOverride[]) => ({
  pncOverrides: {
    Session: {
      Case: {
        Defendant: {
          Offence: dates.map((date) => ({
            BaseOffenceDetails: {
              OffenceTiming: {
                OffenceDateCode: 1,
                OffenceStart: {
                  OffenceDateStartDate: date.startDate
                },
                OffenceEnd: {
                  OffenceEndDate: date.endDate
                }
              }
            }
          }))
        }
      }
    }
  } as Partial<ResultedCaseMessageParsedXml>
})

describe.ifPhase1("TRPR0018", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it.each`
    offenceStart    | offenceEnd      | pncStart        | pncEnd          | description
    ${"2022-02-28"} | ${"2022-03-01"} | ${"2022-02-27"} | ${"2022-03-02"} | ${"offence dates and PNC dates are different, but offence dates are within PNC dates"}
    ${"2022-02-28"} | ${"2022-03-01"} | ${"2022-02-28"} | ${"2022-03-02"} | ${"start dates are the same and offence end is before PNC end date"}
    ${"2022-02-28"} | ${"2022-03-02"} | ${"2022-02-27"} | ${"2022-03-02"} | ${"end dates are the same and offence start date is after PNC start date"}
    ${"2022-02-28"} | ${undefined}    | ${"2022-02-27"} | ${"2022-03-02"} | ${"offence end date is missing and offence start date is after PNC start date"}
    ${"2022-02-28"} | ${undefined}    | ${"2022-02-28"} | ${"2022-03-02"} | ${"offence end date is missing and offence start date is the same as PNC start date"}
    ${"2022-02-28"} | ${"2022-03-01"} | ${"2022-02-27"} | ${undefined}    | ${"PNC end date is missing and offence start date is after the PNC start date"}
  `("should generate trigger when $description", async ({ offenceStart, offenceEnd, pncStart, pncEnd }) => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          startDate: new Date(offenceStart),
          endDate: offenceEnd ? new Date(offenceEnd) : undefined,
          results: [{ code: resultCode }]
        }
      ]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, pncOffenceDateOverrides([{ startDate: pncStart, endDate: pncEnd }]))

    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate multiple triggers for multiple matching offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          startDate: new Date("2021-02-28"),
          endDate: new Date("2021-03-02"),
          results: [{ code: resultCode }]
        },
        {
          startDate: new Date("2022-02-28"),
          endDate: new Date("2022-03-02"),
          results: [{ code: resultCode }]
        }
      ]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(
      inputMessage,
      pncOffenceDateOverrides([
        { startDate: "2021-02-27", endDate: "2021-03-03" },
        { startDate: "2022-02-27", endDate: "2022-03-03" }
      ])
    )

    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([
      { code, offenceSequenceNumber: 1 },
      { code, offenceSequenceNumber: 2 }
    ])
  })

  it("should not generate triggers when the start dates match and offence end date and pnc end date is missing", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          startDate: new Date("2021-02-28"),
          endDate: undefined,
          results: [{ code: resultCode }]
        }
      ]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      expectRecord: false,
      ...pncOffenceDateOverrides([{ startDate: "2021-02-28" }])
    })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toHaveLength(0)
  })

  it("should not generate triggers when all of the dates match", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          startDate: new Date("2021-01-28"),
          endDate: new Date("2021-02-28"),
          results: [{ code: resultCode }]
        }
      ]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      expectRecord: false,
      ...pncOffenceDateOverrides([{ startDate: "2021-01-28", endDate: "2021-02-28" }])
    })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toHaveLength(0)
  })

  it("should not generate triggers when all of the dates are the same", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          startDate: new Date("2021-02-28"),
          endDate: new Date("2021-02-28"),
          results: [{ code: resultCode }]
        }
      ]
    })

    const {
      triggers,
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      expectRecord: false,
      ...pncOffenceDateOverrides([{ startDate: "2021-02-28", endDate: "2021-02-28" }])
    })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toHaveLength(0)
  })
})
