import fs from "fs"
import generateMockPncQueryResult from "../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import handler from "./index"
import CoreAuditLogger from "./lib/CoreAuditLogger"
import MockDate from "mockdate"

describe("Bichard Core processing logic", () => {
  const inputMessage = fs.readFileSync("test-data/input-message-001.xml").toString()
  const mockPncGateway = new MockPncGateway(generateMockPncQueryResult(inputMessage))
  const auditLogger = new CoreAuditLogger()
  const mockedDate = new Date()

  beforeEach(() => {
    MockDate.set(mockedDate)
  })

  it("should return an object with the correct attributes", () => {
    const result = handler(inputMessage, mockPncGateway, auditLogger)
    expect(result).toHaveProperty("triggers")
    expect(result).toHaveProperty("hearingOutcome")
    expect(result).toHaveProperty("events")
  })

  it("should create audit logs when a message received", () => {
    handler(inputMessage, mockPncGateway, auditLogger)
    expect(auditLogger.getEvents()).toEqual([
      {
        eventType: "Started Phase 1 Processing",
        eventSource: "Core Audit Logger",
        category: "information",
        timestamp: mockedDate
      },
      {
        attributes: {
          ASN: "1101ZD0100000448754K",
          "Court Hearing Location": "B01EF01",
          "Date Of Hearing": new Date("2011-09-26T00:00:00.000Z"),
          "Message Size": 7082,
          "Message Type": "SPIResults",
          "Number Of Offences": 3,
          "PSA Code": 2576,
          PTIURN: "01ZD0303208",
          "Time Of Hearing": "10:00",
          "Offence 1 Details": "SX03001A||001||3078",
          "Offence 2 Details": "SX03001||002||3052",
          "Offence 3 Details": "RT88191||003||1015"
        },
        eventType: "Input message received",
        eventSource: "CoreHandler",
        category: "information",
        timestamp: mockedDate
      },
      {
        attributes: {
          "PNC Attempts Made": 1,
          "PNC Response Time": 0
        },
        eventType: "PNC Response received",
        eventSource: "EnrichWithPncQuery",
        category: "information",
        timestamp: mockedDate
      },
      {
        eventType: "Finished Phase 1 Processing",
        eventSource: "Core Audit Logger",
        category: "information",
        timestamp: mockedDate
      }
    ])
  })

  it("should log when an input message is ignored", () => {
    const inputMessageWithNoOffences = fs.readFileSync("test-data/input-message-no-offences.xml").toString()
    handler(inputMessageWithNoOffences, mockPncGateway, auditLogger)
    expect(auditLogger.getEvents()).toEqual([
      {
        eventType: "Started Phase 1 Processing",
        eventSource: "Core Audit Logger",
        category: "information",
        timestamp: mockedDate
      },
      {
        attributes: {
          ASN: "1101ZD0100000448754K"
        },
        eventType: "Hearing Outcome ignored as it contains no offences",
        eventSource: "CoreHandler",
        category: "information",
        timestamp: mockedDate
      },
      {
        eventType: "Finished Phase 1 Processing",
        eventSource: "Core Audit Logger",
        category: "information",
        timestamp: mockedDate
      }
    ])
  })

  it("should log hearing outcome passed to error list", () => {
    const inputMessageWithNoOffences = fs.readFileSync("test-data/input-message-003.xml").toString()
    handler(inputMessageWithNoOffences, mockPncGateway, auditLogger)
    expect(auditLogger.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attributes: {
            ASN: "1101ZD0100000410769X",
            "Error 1 Details": "HO100304||ArrestSummonsNumber",
            "Exception Type": "HO100304",
            "Number Of Errors": "1"
          },
          eventType: "Hearing Outcome passed to Error List",
          eventSource: "CoreHandler",
          category: "information",
          timestamp: mockedDate
        })
      ])
    )
  })
})
