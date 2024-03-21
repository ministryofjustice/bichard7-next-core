import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import MockDate from "mockdate"
import CoreAuditLogger from "../../../lib/CoreAuditLogger"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type PncGatewayInterface from "../../../types/PncGatewayInterface"
import MockPncGateway from "../../../comparison/lib/MockPncGateway"
import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import generateMessage from "../../tests/helpers/generateMessage"
import generateMockPncQueryResult from "../../tests/helpers/generateMockPncQueryResult"
import type AuditLogger from "../../types/AuditLogger"
import enrichWithPncQuery from "./enrichWithPncQuery"

describe("enrichWithQuery()", () => {
  let incomingMessage: string
  let aho: AnnotatedHearingOutcome
  let pncGateway: PncGatewayInterface
  let auditLogger: AuditLogger
  const mockedDate = new Date()

  beforeEach(() => {
    MockDate.set(mockedDate)
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

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

  it("should enrich AHO with results from PNC query", async () => {
    expect(aho.PncQuery).toBeUndefined()
    const resultAho = await enrichWithPncQuery(aho, pncGateway, auditLogger)
    const expected = await pncGateway.query("MockASN", "Mock correlation ID")
    expect(resultAho.PncQuery).toBe(expected)
  })

  it("should populate the court case offence titles from PNC query", async () => {
    const result = await enrichWithPncQuery(aho, pncGateway, auditLogger)
    const offences = result.PncQuery?.courtCases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })

  it("should populate the penalty case offence titles from PNC query", async () => {
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
    const result = await enrichWithPncQuery(aho, pncGateway, auditLogger)
    const offences = result.PncQuery?.penaltyCases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })

  it("should set the PNC query date element to undefined if it is not set", async () => {
    expect(aho.PncQueryDate).toBeUndefined()
    const resultAho = await enrichWithPncQuery(aho, pncGateway, auditLogger)
    expect(resultAho.PncQueryDate).toBeUndefined()
  })

  it("should log a successful PNC query", async () => {
    const auditLoggerSpy = jest.spyOn(auditLogger, "info")
    await enrichWithPncQuery(aho, pncGateway, auditLogger)

    expect(auditLoggerSpy).toHaveBeenCalledTimes(1)
    expect(auditLoggerSpy).toHaveBeenCalledWith(EventCode.PncResponseReceived, {
      "PNC Request Message": "1101ZD0100000448754K",
      "PNC Response Time": 0,
      "PNC Request Type": "enquiry",
      "PNC Attempts Made": 1,
      "PNC Response Message": await pncGateway.query("1101ZD0100000448754K", "Mock correlation ID"),
      sensitiveAttributes: "PNC Request Message,PNC Response Message"
    })
  })

  it("should log a failed PNC query", async () => {
    const auditLoggerSpy = jest.spyOn(auditLogger, "info")
    jest.spyOn(pncGateway, "query").mockImplementation(() => {
      return Promise.resolve(new Error("PNC error"))
    })

    await enrichWithPncQuery(aho, pncGateway, auditLogger)

    expect(auditLoggerSpy).toHaveBeenCalledTimes(1)
    expect(auditLoggerSpy).toHaveBeenCalledWith(EventCode.PncResponseReceived, {
      "PNC Response Time": 0,
      "PNC Attempts Made": 1,
      "PNC Request Message": "1101ZD0100000448754K",
      "PNC Request Type": "enquiry",
      "PNC Response Message": "PNC error",
      sensitiveAttributes: "PNC Request Message,PNC Response Message"
    })
  })
})
