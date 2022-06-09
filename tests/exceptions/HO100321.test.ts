jest.setTimeout(30000)

import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100321", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception when there is a recordable offence but the Arrest Summons Number is a dummy", async () => {
    const dummyASN = "0807NRPR00000038482H"

    // Generate a mock message
    const inputMessage = generateMessage({
      ASN: dummyASN,
      offences: [{ results: [{ code: 4592 }], recordable: true }]
    })

    // Process the mock message
    const { exceptions } = await processMessage(inputMessage, {
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
})
