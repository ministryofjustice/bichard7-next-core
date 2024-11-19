import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import type { ResultedCaseMessageParsedXml } from "../types/IncomingMessage"

import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const code = TriggerCode.TRPR0018
const resultCode = 1015

type PncOffenceDateOverride = {
  endDate?: string
  startDate: string
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
                OffenceEnd: {
                  OffenceEndDate: date.endDate
                },
                OffenceStart: {
                  OffenceDateStartDate: date.startDate
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
  `("should generate trigger when $description", async ({ offenceEnd, offenceStart, pncEnd, pncStart }) => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          endDate: offenceEnd ? new Date(offenceEnd) : undefined,
          results: [{ code: resultCode }],
          startDate: new Date(offenceStart)
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(inputMessage, pncOffenceDateOverrides([{ endDate: pncEnd, startDate: pncStart }]))

    expect(exceptions).toHaveLength(0)
    expect(triggers).toStrictEqual([{ code, offenceSequenceNumber: 1 }])
  })

  it("should generate multiple triggers for multiple matching offences", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          endDate: new Date("2021-03-02"),
          results: [{ code: resultCode }],
          startDate: new Date("2021-02-28")
        },
        {
          endDate: new Date("2022-03-02"),
          results: [{ code: resultCode }],
          startDate: new Date("2022-02-28")
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(
      inputMessage,
      pncOffenceDateOverrides([
        { endDate: "2021-03-03", startDate: "2021-02-27" },
        { endDate: "2022-03-03", startDate: "2022-02-27" }
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
          endDate: undefined,
          results: [{ code: resultCode }],
          startDate: new Date("2021-02-28")
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
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
          endDate: new Date("2021-02-28"),
          results: [{ code: resultCode }],
          startDate: new Date("2021-01-28")
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(inputMessage, {
      expectRecord: false,
      ...pncOffenceDateOverrides([{ endDate: "2021-02-28", startDate: "2021-01-28" }])
    })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toHaveLength(0)
  })

  it("should not generate triggers when all of the dates are the same", async () => {
    const inputMessage = generateSpiMessage({
      offences: [
        {
          endDate: new Date("2021-02-28"),
          results: [{ code: resultCode }],
          startDate: new Date("2021-02-28")
        }
      ]
    })

    const {
      hearingOutcome: { Exceptions: exceptions },
      triggers
    } = await processPhase1Message(inputMessage, {
      expectRecord: false,
      ...pncOffenceDateOverrides([{ endDate: "2021-02-28", startDate: "2021-02-28" }])
    })

    expect(exceptions).toHaveLength(0)
    expect(triggers).toHaveLength(0)
  })
})
