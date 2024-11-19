import PostgresHelper from "@moj-bichard7/common/db/PostgresHelper"
import generateSpiMessage from "../helpers/generateSpiMessage"
import { processPhase1Message } from "../helpers/processMessage"

const dummyASN = "0807NRPR00000038482H"

describe.ifPhase1("HO100321", () => {
  afterAll(async () => {
    await new PostgresHelper().closeConnection()
  })

  it("should create an exception when there is a recordable offence but the Arrest Summons Number is a dummy", async () => {
    const inputMessage = generateSpiMessage({
      ASN: dummyASN,
      offences: [{ results: [{ code: 4592 }], recordable: true }]
    })

    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: true
    })

    expect(exceptions).toStrictEqual([
      {
        code: "HO100321",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("should not create an exception when there is no recordable offence", async () => {
    const nonRecordableOffenceCode = "BA76004"

    const inputMessage = generateSpiMessage({
      offences: [
        {
          code: nonRecordableOffenceCode,
          results: [{ code: 4592 }],
          recordable: false
        }
      ]
    })
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processPhase1Message(inputMessage, {
      recordable: false
    })

    expect(exceptions).toHaveLength(0)
  })
})
