import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type PncGateway from "../../types/PncGateway"
import generateMessage from "../../../tests/helpers/generateMessage"
import generateMockPncQueryResult from "../../../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../../../tests/helpers/MockPncGateway"
import enrichWithPncQuery from "./enrichWithPncQuery"
import type AuditLogger from "src/types/AuditLogger"
import CoreAuditLogger from "src/lib/CoreAuditLogger"
import MockDate from "mockdate"

describe("enrichWithQuery()", () => {
  let incomingMessage: string
  let aho: AnnotatedHearingOutcome
  let pncGateway: PncGateway
  let auditLogger: AuditLogger
  const mockedDate = new Date()

  beforeEach(() => {
    MockDate.set(mockedDate)
    auditLogger = new CoreAuditLogger()
    auditLogger.start("Test")

    const options = {
      offences: [
        { code: "BG73005", results: [{}] },
        { code: "BG73006", results: [{}] }
      ]
    }

    incomingMessage = generateMessage(options)
    const spiResult = parseSpiResult(incomingMessage)
    aho = transformSpiToAho(spiResult)

    const response = generateMockPncQueryResult(incomingMessage)
    pncGateway = new MockPncGateway(response)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it("should enrich AHO with results from PNC query", () => {
    expect(aho.PncQuery).toBeUndefined()
    const resultAho = enrichWithPncQuery(aho, pncGateway, auditLogger)
    expect(resultAho.PncQuery).toBe(pncGateway.query("MockASN"))
  })

  it("should populate the court case offence titles from PNC query", () => {
    const result = enrichWithPncQuery(aho, pncGateway, auditLogger)
    const offences = result.PncQuery?.courtCases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })

  it("should populate the penalty case offence titles from PNC query", () => {
    pncGateway = new MockPncGateway({
      forceStationCode: "01ZB",
      croNumber: "dummy",
      checkName: "test",
      pncId: "dummyId",
      penaltyCases: [
        {
          penaltyCaseReference: "dummy",
          offences: [
            {
              offence: {
                cjsOffenceCode: "BG73005",
                acpoOffenceCode: "",
                startDate: new Date("2010-11-28"),
                sequenceNumber: 1
              }
            },
            {
              offence: {
                cjsOffenceCode: "BG73006",
                acpoOffenceCode: "",
                startDate: new Date("2010-11-28"),
                sequenceNumber: 1
              }
            }
          ]
        }
      ]
    })
    const result = enrichWithPncQuery(aho, pncGateway, auditLogger)
    const offences = result.PncQuery?.penaltyCases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })

  it("should set the PNC query date element to undefined if it is not set", () => {
    expect(aho.PncQueryDate).toBeUndefined()
    const resultAho = enrichWithPncQuery(aho, pncGateway, auditLogger)
    expect(resultAho.PncQueryDate).toBeUndefined()
  })

  it("should log a successful PNC query", () => {
    const auditLoggerSpy = jest.spyOn(auditLogger, "logEvent")
    enrichWithPncQuery(aho, pncGateway, auditLogger)

    expect(auditLoggerSpy).toHaveBeenCalledTimes(1)
    expect(auditLoggerSpy).toHaveBeenCalledWith({
      eventType: "PNC Response received",
      eventSource: "EnrichWithPncQuery",
      category: "information",
      timestamp: mockedDate
    })
  })

  it("should log a failed PNC query", () => {
    const auditLoggerSpy = jest.spyOn(auditLogger, "logEvent")
    jest.spyOn(pncGateway, "query").mockImplementation(() => {
      return new Error("PNC error")
    })

    enrichWithPncQuery(aho, pncGateway, auditLogger)

    expect(auditLoggerSpy).toHaveBeenCalledTimes(1)
    expect(auditLoggerSpy).toHaveBeenCalledWith({
      eventType: "PNC Response not received",
      eventSource: "EnrichWithPncQuery",
      category: "warning",
      timestamp: mockedDate
    })
  })
})
