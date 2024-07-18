import { AuditLogEventSource, auditLogEventLookup } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import EventCode from "@moj-bichard7/common/types/EventCode"
import fs from "fs"
import MockDate from "mockdate"
import MockPncGateway from "../comparison/lib/MockPncGateway"
import CoreAuditLogger from "../lib/CoreAuditLogger"
import parseSpiResult from "../lib/parse/parseSpiResult"
import transformSpiToAho from "../lib/parse/transformSpiToAho"
import phase1Handler from "./phase1"
import generateMockPncQueryResult from "./tests/helpers/generateMockPncQueryResult"

describe("Bichard Core processing logic", () => {
  const inputMessage = fs.readFileSync("phase1/tests/fixtures/input-message-001.xml").toString()
  const inputSpi = parseSpiResult(inputMessage)
  const inputAho = transformSpiToAho(inputSpi)
  const mockPncGateway = new MockPncGateway(generateMockPncQueryResult(inputMessage))
  let auditLogger: CoreAuditLogger
  const mockedDate = new Date()

  beforeEach(() => {
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
    MockDate.set(mockedDate)
  })

  it("should return an object with the correct attributes", async () => {
    const result = await phase1Handler(inputAho, mockPncGateway, auditLogger)
    expect(result).toHaveProperty("auditLogEvents")
    expect(result).toHaveProperty("hearingOutcome")
    expect(result).toHaveProperty("triggers")
  })

  it("should create audit logs when a message is received", async () => {
    await phase1Handler(inputAho, mockPncGateway, auditLogger)
    expect(auditLogger.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attributes: {
            ASN: "1101ZD0100000448754K",
            "Court Hearing Location": "B01EF01",
            "Date Of Hearing": "2011-09-26",
            // "Message Size": 7082,
            // "Message Type": "SPIResults",
            "Number Of Offences": 3,
            "PSA Code": 2576,
            PTIURN: "01ZD0303208",
            "Time Of Hearing": "10:00",
            "Offence 1 Details": "SX03001A||001||3078",
            "Offence 2 Details": "SX03001||002||3052",
            "Offence 3 Details": "RT88191||003||1015",
            "Force Owner": "010000"
          },
          eventType: auditLogEventLookup[EventCode.HearingOutcomeDetails],
          eventCode: EventCode.HearingOutcomeDetails,
          eventSource: AuditLogEventSource.CorePhase1,
          category: EventCategory.information,
          timestamp: mockedDate
        })
      ])
    )
  })

  it("should log when an input message is ignored", async () => {
    const inputMessageWithNoOffences = fs.readFileSync("phase1/tests/fixtures/input-message-no-offences.xml").toString()
    const inputSpiWithNoOffences = parseSpiResult(inputMessageWithNoOffences)
    const inputAhoWithNoOffences = transformSpiToAho(inputSpiWithNoOffences)
    await phase1Handler(inputAhoWithNoOffences, mockPncGateway, auditLogger)
    expect(auditLogger.getEvents()).toEqual([
      {
        attributes: {
          ASN: "1101ZD0100000448754K"
        },
        eventType: auditLogEventLookup[EventCode.IgnoredNoOffences],
        eventCode: EventCode.IgnoredNoOffences,
        eventSource: AuditLogEventSource.CorePhase1,
        category: EventCategory.information,
        timestamp: mockedDate
      }
    ])
  })

  it("should log exceptions generated", async () => {
    const inputMessageWithNoOffences = fs.readFileSync("phase1/tests/fixtures/input-message-003.xml").toString()
    const inputSpiWithNoOffences = parseSpiResult(inputMessageWithNoOffences)
    const inputAhoWithNoOffences = transformSpiToAho(inputSpiWithNoOffences)
    await phase1Handler(inputAhoWithNoOffences, mockPncGateway, auditLogger)
    expect(auditLogger.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attributes: {
            "Error 1 Details": "HO100304||ArrestSummonsNumber",
            "Exception Type": "HO100304",
            "Number Of Errors": 1
          },
          eventType: auditLogEventLookup[EventCode.ExceptionsGenerated],
          eventCode: EventCode.ExceptionsGenerated,
          eventSource: AuditLogEventSource.CorePhase1,
          category: EventCategory.information,
          timestamp: mockedDate
        })
      ])
    )
  })
})
