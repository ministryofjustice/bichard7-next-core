jest.setTimeout(30000)

import type { ResultedCaseMessageParsedXml } from "../../src/types/IncomingMessage"
import { TriggerCode } from "../../src/types/TriggerCode"
import generateMessage from "../helpers/generateMessage"
import PostgresHelper from "../helpers/PostgresHelper"
import processMessage from "../helpers/processMessage"

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

describe("TRPR0018", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
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
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          startDate: new Date(offenceStart),
          endDate: offenceEnd ? new Date(offenceEnd) : undefined,
          results: [{ code: resultCode }]
        }
      ]
    })

    // Process the mock message
    const result = await processMessage(
      inputMessage,
      pncOffenceDateOverrides([{ startDate: pncStart, endDate: pncEnd }])
    )

    // Check the right triggers are generated
    expect(result).toStrictEqual({ exceptions: [], triggers: [{ code, offenceSequenceNumber: 1 }] })
  })

  it("should generate multiple triggers for multiple matching offences", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
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

    // Process the mock message
    const result = await processMessage(
      inputMessage,
      pncOffenceDateOverrides([
        { startDate: "2021-02-27", endDate: "2021-03-03" },
        { startDate: "2022-02-27", endDate: "2022-03-03" }
      ])
    )

    // Check the right triggers are generated
    expect(result).toStrictEqual({
      exceptions: [],
      triggers: [
        { code, offenceSequenceNumber: 1 },
        { code, offenceSequenceNumber: 2 }
      ]
    })
  })
})
