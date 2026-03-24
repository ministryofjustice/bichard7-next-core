import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceQueryResult } from "@moj-bichard7/common/types/PoliceQueryResult"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"
import parseSpiResult from "@moj-bichard7/common/aho/parse/parseSpiResult"
import transformSpiToAho from "@moj-bichard7/common/aho/parse/transformSpiToAho/index"
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import MockDate from "mockdate"

import type AuditLogger from "../../../types/AuditLogger"
import type PoliceGateway from "../../../types/PoliceGateway"
import type { default as enrichWithQueryType } from "./enrichWithPncQuery"

import CoreAuditLogger from "../../../lib/auditLog/CoreAuditLogger"
import PoliceApiError from "../../../lib/policeGateway/PoliceApiError"
import MockPoliceGateway from "../../../tests/helpers/MockPoliceGateway"
import generateMessage from "../../tests/helpers/generateMessage"
import generateMockPncQueryResult from "../../tests/helpers/generateMockPncQueryResult"

describe("enrichWithPoliceQuery", () => {
  describe("when using PNC", () => {
    let incomingMessage: string
    let aho: AnnotatedHearingOutcome
    let pncGateway: PoliceGateway
    let auditLogger: AuditLogger
    let response: PoliceQueryResult
    let isIgnored = false
    let enrichWithPncQuery: typeof enrichWithQueryType
    const mockedDate = new Date()

    beforeEach(async () => {
      process.env.USE_LEDS = undefined
      jest.resetModules()
      enrichWithPncQuery = (await import("./enrichWithPncQuery")).default
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
      pncGateway = new MockPoliceGateway(response)
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
      pncGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

      const result = await enrichWithPncQuery(aho, pncGateway, auditLogger, isIgnored)
      const exceptions = result.Exceptions

      expect(exceptions).toHaveLength(0)
    })

    describe("when the case is not recordable", () => {
      it("should generate PNC exceptions from PNC error messages when the error is not a 'not found' error", async () => {
        const errorMessages = ["I0013 - message 1", "I0208 - message 2"]
        pncGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

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
        pncGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

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
        pncGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

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
        pncGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

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
      pncGateway = new MockPoliceGateway({
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
        return Promise.resolve(new PoliceApiError(["PNC error", "PNC error 2"]))
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
      const gateway = new MockPoliceGateway({
        ...generateMockPncQueryResult(incomingMessage),
        pncId
      })
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier = "aho_pncid"

      const resultAho = await enrichWithPncQuery(aho, gateway, auditLogger, isIgnored)

      expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier).toBe(pncId)
    })
  })

  describe("when using LEDS", () => {
    let incomingMessage: string
    let aho: AnnotatedHearingOutcome
    let ledsGateway: PoliceGateway
    let auditLogger: AuditLogger
    let response: PoliceQueryResult
    let isIgnored = false
    let enrichWithPncQuery: typeof enrichWithQueryType
    const mockedDate = new Date()

    beforeEach(async () => {
      process.env.USE_LEDS = "true"
      jest.resetModules()
      enrichWithPncQuery = (await import("./enrichWithPncQuery")).default
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
      ledsGateway = new MockPoliceGateway(response)
      isIgnored = false
    })

    afterAll(() => {
      MockDate.reset()
    })

    it("should enrich AHO with results from LEDS query", async () => {
      const resultAho = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)

      expect(resultAho.PncQuery).toBe(response)
    })

    it("should populate the court case offence titles from LEDS query", async () => {
      const result = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)
      const offences = result.PncQuery?.courtCases![0].offences

      expect(offences).toHaveLength(2)
      expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
      expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
    })

    it("should not generate exceptions when the AHO is ignored", async () => {
      isIgnored = true
      const errorMessages = ["dummy error"]
      ledsGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

      const result = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)
      const exceptions = result.Exceptions

      expect(exceptions).toHaveLength(0)
    })

    describe("when the case is not recordable", () => {
      it("should generate exceptions from LEDS error messages when the error is not a 'not found' error", async () => {
        const errorMessages = ["dummy error", "another dummy error"]
        ledsGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

        const result = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)
        const exceptions = result.Exceptions

        expect(exceptions).toHaveLength(2)
        expect(exceptions[0]).toStrictEqual({
          code: ExceptionCode.HO100314,
          path: errorPaths.case.asn,
          message: errorMessages[0]
        })
        expect(exceptions[1]).toStrictEqual({
          code: ExceptionCode.HO100314,
          path: errorPaths.case.asn,
          message: errorMessages[1]
        })
      })

      it("should not generate exceptions when there is a 'not found' error", async () => {
        const errorMessages = ["No matching arrest reports found for asn: 26/0000/00/00000001458F"]
        ledsGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

        const result = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)
        const exceptions = result.Exceptions

        expect(exceptions).toHaveLength(0)
      })
    })

    describe("when the case is recordable", () => {
      beforeEach(() => {
        aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[0].RecordableOnPNCindicator = true
      })

      it("should generate exceptions when there is a 'not found' error", async () => {
        const errorMessages = ["No matching arrest reports found for asn: 26/0000/00/00000001458F"]
        ledsGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

        const result = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)
        const exceptions = result.Exceptions

        expect(exceptions).toHaveLength(1)
        expect(exceptions[0]).toStrictEqual({
          code: ExceptionCode.HO100301,
          path: errorPaths.case.asn,
          message: errorMessages[0]
        })
      })

      it("should generate exceptions from LEDS error messages when there is not a 'not found' error", async () => {
        const errorMessages = ["error message 1", "error message 2"]
        ledsGateway = new MockPoliceGateway(new PoliceApiError(errorMessages))

        const result = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)
        const exceptions = result.Exceptions

        expect(exceptions).toHaveLength(2)
        expect(exceptions[0]).toStrictEqual({
          code: ExceptionCode.HO100314,
          path: errorPaths.case.asn,
          message: errorMessages[0]
        })
        expect(exceptions[1]).toStrictEqual({
          code: ExceptionCode.HO100314,
          path: errorPaths.case.asn,
          message: errorMessages[1]
        })
      })
    })

    it("should set the police query date element to undefined if it is not set", async () => {
      expect(aho.PncQueryDate).toBeUndefined()
      const resultAho = await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)
      expect(resultAho.PncQueryDate).toBeUndefined()
    })

    it("should log a successful police query", async () => {
      const auditLoggerSpy = jest.spyOn(auditLogger, "info")
      await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)

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

    it("should log a failed LEDS query", async () => {
      const auditLoggerSpy = jest.spyOn(auditLogger, "info")
      jest.spyOn(ledsGateway, "query").mockImplementation(() => {
        return Promise.resolve(new PoliceApiError(["LEDS error", "LEDS error 2"]))
      })

      await enrichWithPncQuery(aho, ledsGateway, auditLogger, isIgnored)

      expect(auditLoggerSpy).toHaveBeenCalledTimes(1)
      expect(auditLoggerSpy).toHaveBeenCalledWith(EventCode.PncResponseReceived, {
        "PNC Response Time": 0,
        "PNC Attempts Made": 1,
        "PNC Request Message": "1101ZD0100000448754K",
        "PNC Request Type": "enquiry",
        "PNC Response Message": "LEDS error, LEDS error 2",
        sensitiveAttributes: "PNC Request Message,PNC Response Message"
      })
    })

    it("should set the Person URN from LEDS response if returned", async () => {
      const personUrn = "leds_response_person_urn"
      const gateway = new MockPoliceGateway({
        ...generateMockPncQueryResult(incomingMessage),
        pncId: personUrn
      })
      aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier = "aho_person_urn"

      const resultAho = await enrichWithPncQuery(aho, gateway, auditLogger, isIgnored)

      expect(resultAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier).toBe(personUrn)
    })
  })
})
