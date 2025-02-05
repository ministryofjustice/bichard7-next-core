import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import MockDate from "mockdate"

import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type AuditLogger from "../../../types/AuditLogger"
import type PncGatewayInterface from "../../../types/PncGatewayInterface"
import type { PncQueryResult } from "../../../types/PncQueryResult"

import MockPncGateway from "../../../comparison/lib/MockPncGateway"
import CoreAuditLogger from "../../../lib/auditLog/CoreAuditLogger"
import errorPaths from "../../../lib/exceptions/errorPaths"
import parseSpiResult from "../../../lib/parse/parseSpiResult"
import transformSpiToAho from "../../../lib/parse/transformSpiToAho"
import { PncApiError } from "../../../lib/pnc/PncGateway"
import generateMessage from "../../tests/helpers/generateMessage"
import generateMockPncQueryResult from "../../tests/helpers/generateMockPncQueryResult"
import enrichWithPncQuery from "./enrichWithPncQuery"

describe("enrichWithQuery()", () => {
  let incomingMessage: string
  let aho: AnnotatedHearingOutcome
  let pncGateway: PncGatewayInterface
  let auditLogger: AuditLogger
  let response: PncQueryResult
  let isIgnored = false
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

    response = generateMockPncQueryResult(incomingMessage)
    pncGateway = new MockPncGateway(response)
    isIgnored = false
  })

  afterAll(() => {
    MockDate.reset()
  })

  it("should enrich AHO with results from PNC query", async () => {
    const resultAho = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)

    expect(resultAho.PncQuery).toBe(response)
  })

  it("should populate the court case offence titles from PNC query", async () => {
    const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
    const offences = result.PncQuery?.courtCases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })

  it("should not generate PNC exceptions when the AHO is ignored", async () => {
    isIgnored = true
    const errorMessages = ["I1009 PNC ERROR MESSAGE"]
    pncGateway = new MockPncGateway(new PncApiError(errorMessages))

    const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
    const exceptions = result.Exceptions

    expect(exceptions).toHaveLength(0)
  })

  describe("when the case is not recordable", () => {
    it("should generate PNC exceptions from PNC error messages when the error is not a 'not found' error", async () => {
      const errorMessages = ["I0013 - message 1", "I0208 - message 2"]
      pncGateway = new MockPncGateway(new PncApiError(errorMessages))

      const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
      const exceptions = result.Exceptions

      expect(exceptions).toHaveLength(2)
      expect(exceptions[0]).toStrictEqual({
        code: ExceptionCode.HO100301,
        path: errorPaths.case.asn,
        message: errorMessages[0]
      })
      expect(exceptions[1]).toStrictEqual({
        code: ExceptionCode.HO100313,
        path: errorPaths.case.asn,
        message: errorMessages[1]
      })
    })

    it("should not generate PNC exceptions when there is a 'not found' error", async () => {
      const errorMessages = ["I1008 ARREST/SUMMONS REF ABC123 NOT FOUND"]
      pncGateway = new MockPncGateway(new PncApiError(errorMessages))

      const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
      const exceptions = result.Exceptions

      expect(exceptions).toHaveLength(0)
    })
  })

  describe("when the case is recordable", () => {
    beforeEach(() => {
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].RecordableOnPNCindicator = true
    })

    it("should generate PNC exceptions when there is a 'not found' error", async () => {
      const errorMessages = ["I1008 ARREST/SUMMONS REF ABC123 NOT FOUND"]
      pncGateway = new MockPncGateway(new PncApiError(errorMessages))

      const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
      const exceptions = result.Exceptions

      expect(exceptions).toHaveLength(1)
      expect(exceptions[0]).toStrictEqual({
        code: ExceptionCode.HO100301,
        path: errorPaths.case.asn,
        message: errorMessages[0]
      })
    })

    it("should generate PNC exceptions from PNC error messages when there is not a 'not found' error", async () => {
      const errorMessages = ["I0013 - message 1", "I0208 - message 2"]
      pncGateway = new MockPncGateway(new PncApiError(errorMessages))

      const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
      const exceptions = result.Exceptions

      expect(exceptions).toHaveLength(2)
      expect(exceptions[0]).toStrictEqual({
        code: ExceptionCode.HO100301,
        path: errorPaths.case.asn,
        message: errorMessages[0]
      })
      expect(exceptions[1]).toStrictEqual({
        code: ExceptionCode.HO100313,
        path: errorPaths.case.asn,
        message: errorMessages[1]
      })
    })
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
    const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
    const offences = result.PncQuery?.penaltyCases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })

  it("should set the PNC query date element to undefined if it is not set", async () => {
    expect(aho.PncQueryDate).toBeUndefined()
    const resultAho = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
    expect(resultAho.PncQueryDate).toBeUndefined()
  })

  it("should log a successful PNC query", async () => {
    const auditLoggerSpy = jest.spyOn(auditLogger, "info")
    await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)

    expect(auditLoggerSpy).toHaveBeenCalledTimes(1)
    expect(auditLoggerSpy).toHaveBeenCalledWith(EventCode.PncResponseReceived, {
      "PNC Request Message": "1101ZD0100000448754K",
      "PNC Response Time": 0,
      "PNC Request Type": "enquiry",
      "PNC Attempts Made": 1,
      "PNC Response Message": response,
      sensitiveAttributes: "PNC Request Message,PNC Response Message"
    })
  })

  it("should log a failed PNC query", async () => {
    const auditLoggerSpy = jest.spyOn(auditLogger, "info")
    jest.spyOn(pncGateway, "query").mockImplementation(() => {
      return Promise.resolve(new PncApiError(["PNC error", "PNC error 2"]))
    })

    await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)

    expect(auditLoggerSpy).toHaveBeenCalledTimes(1)
    expect(auditLoggerSpy).toHaveBeenCalledWith(EventCode.PncResponseReceived, {
      "PNC Response Time": 0,
      "PNC Attempts Made": 1,
      "PNC Request Message": "1101ZD0100000448754K",
      "PNC Request Type": "enquiry",
      "PNC Response Message": "PNC error, PNC error 2",
      sensitiveAttributes: "PNC Request Message,PNC Response Message"
    })
  })

  it("should set the PNCIdentifier from PNC response if returned", async () => {
    const pncId = "pnc_response_pncid"
    const gateway = new MockPncGateway({
      ...generateMockPncQueryResult(incomingMessage),
      pncId
    })
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier = "aho_pncid"

    const resultAho = await enrichWithPncQuery(aho, gateway, auditLogger, isIgnored)

    expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier).toBe(pncId)
  })
})
