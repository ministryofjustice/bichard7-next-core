jest.setTimeout(30000)

import errorPaths from "src/lib/errorPaths"
import generateMessage from "tests/helpers/generateMessage"
import PostgresHelper from "tests/helpers/PostgresHelper"
import processMessage from "tests/helpers/processMessage"

describe("HO100325", () => {
  afterAll(() => {
    PostgresHelper.closeConnection()
  })

  it("should create an exception when the conviction date is before the date of hearing and there is no adjudication", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          convictionDate: "2011-09-25",
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true
        }
      ]
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
        code: "HO100325",
        path: errorPaths.offence(0).result(0).resultClass
      }
    ])
  })

  it("should not create an exception when the offence was added by the court", async () => {
    // Generate a mock message
    const inputMessage = generateMessage({
      offences: [
        {
          convictionDate: "2011-09-25",
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true,
          offenceSequenceNumber: 1
        },
        {
          convictionDate: "2011-09-25",
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true,
          offenceSequenceNumber: 2
        }
      ]
    })

    const pncMessage = generateMessage({
      offences: [
        {
          convictionDate: "2011-09-25",
          results: [{ code: 4001, nextHearing: { nextHearingDetails: {} } }],
          recordable: true,
          offenceSequenceNumber: 1
        }
      ]
    })

    // Process the mock message
    const {
      hearingOutcome: { Exceptions: exceptions }
    } = await processMessage(inputMessage, {
      expectTriggers: false,
      recordable: true,
      pncMessage
    })

    // Check the right triggers are generated
    expect(exceptions).toStrictEqual([
      {
        code: "HO100325",
        path: errorPaths.offence(0).result(0).resultClass
      }
    ])
  })
})
