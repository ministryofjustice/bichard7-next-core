jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

const dummyASN = "0807NRPR00000038482H"

describe("HO100321", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception when there is a recordable offence but the Arrest Summons Number is a dummy", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      ASN: dummyASN,
      offences: [{ results: [{ code: 4592 }], recordable: true }]
    })

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false,
      recordable: true
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100321",
        path: ["AnnotatedHearingOutcome", "HearingOutcome", "Case", "HearingDefendant", "ArrestSummonsNumber"]
      }
    ])
  })

  it("should not create an exception when there is no recordable offence", async () => {
    const nonRecordableOffenceCode = "BA76004"

    const inputMessage = generateMessage({
      ASN: dummyASN,
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
    } = await processMessage(inputMessage, {
      expectTriggers: false,
      recordable: false
    })

    expect(exceptions).toHaveLength(0)
  })
})
