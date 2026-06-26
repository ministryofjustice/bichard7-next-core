import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { isError } from "@moj-bichard7/common/types/Result"
import axios from "axios"

import type AuditLogger from "../../../types/AuditLogger"

import generateFakeAho from "../../../phase1/tests/helpers/generateFakeAho"
import CoreAuditLogger from "../../auditLog/CoreAuditLogger"
import PncGateway from "./PncGateway"

jest.mock("axios")
const mockedGet = jest.fn()
;(axios.create as jest.Mock).mockReturnValue({
  get: mockedGet
})

const pncResponseMessageAttribute = {
  checkName: "TRTHREE",
  courtCases: [
    {
      courtCaseReference: "97/1626/008395Q",
      crimeOffenceReference: undefined,
      offences: [
        {
          adjudication: undefined,
          disposals: undefined,
          offence: {
            acpoOffenceCode: "12:15:24:1",
            cjsOffenceCode: "TH68006",
            endDate: undefined,
            endTime: undefined,
            qualifier1: undefined,
            qualifier2: undefined,
            sequenceNumber: 1,
            startDate: new Date("2010-11-28T00:00:00.000Z"),
            startTime: "00:00",
            title: "Theft of pedal cycle"
          }
        },
        {
          adjudication: undefined,
          disposals: undefined,
          offence: {
            acpoOffenceCode: "12:15:24:1",
            cjsOffenceCode: "RT88191",
            endDate: undefined,
            endTime: undefined,
            qualifier1: undefined,
            qualifier2: undefined,
            sequenceNumber: 2,
            startDate: new Date("2010-11-28T00:00:00.000Z"),
            startTime: "00:00",
            title: "Use a motor vehicle on a road / public place without third party insurance"
          }
        }
      ]
    }
  ],
  croNumber: undefined,
  forceStationCode: "01ZD",
  penaltyCases: [],
  pncId: "2000/0410770Y"
}

const pncQueryResponse = {
  forceStationCode: "01ZD",
  pncCheckName: "TRTHREE",
  pncIdentifier: "2000/0410770Y",
  penaltyCases: [],
  courtCases: [
    {
      courtCaseRefNo: "97/1626/008395Q",
      offences: [
        {
          acpoOffenceCode: "12:15:24:1",
          cjsOffenceCode: "TH68006",
          title: "Theft of pedal cycle",
          referenceNumber: "1",
          qualifier1: "",
          qualifier2: "",
          startDate: new Date("2010-11-28T00:00:00.000Z"),
          startTime: "00:00",
          disposals: []
        },
        {
          acpoOffenceCode: "12:15:24:1",
          cjsOffenceCode: "RT88191",
          title: "Use a motor vehicle on a road / public place without third party insurance",
          referenceNumber: "2",
          qualifier1: "",
          qualifier2: "",
          startDate: new Date("2010-11-28T00:00:00.000Z"),
          startTime: "00:00",
          disposals: []
        }
      ]
    }
  ]
}

describe("PncGateway", () => {
  let auditLogger: AuditLogger
  let pncGateway: PncGateway
  const aho = generateFakeAho({})

  beforeEach(() => {
    mockedGet.mockClear()
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
    pncGateway = new PncGateway(
      {
        key: "dummy-key",
        url: "https://dummy"
      },
      auditLogger
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("should generate audit log event when PNC query is successful", async () => {
    mockedGet.mockResolvedValue({ data: pncQueryResponse })

    const result = await pncGateway.query("dummy asn", "dummy correlation id", aho)

    expect(isError(result)).toBe(false)
    expect(auditLogger.getEvents()).toEqual([
      {
        attributes: {
          "PNC Attempts Made": 1,
          "PNC Request Message": "1101ZD0100000410770Y",
          "PNC Request Type": "enquiry",
          "PNC Response Message": pncResponseMessageAttribute,
          "PNC Response Time": expect.any(Number),
          sensitiveAttributes: "PNC Request Message,PNC Response Message"
        },
        category: "information",
        eventCode: "pnc.response-received",
        eventSource: "CorePhase1",
        eventType: "PNC Response received",
        timestamp: expect.anything()
      }
    ])
  })

  it("should generate audit log event when PNC query fails and returns PNC errors", async () => {
    mockedGet.mockRejectedValue({ response: { data: { errors: ["PNC error", "PNC error 2"] } } })

    const result = await pncGateway.query("dummy asn", "dummy correlation id", aho)

    expect(isError(result)).toBe(true)
    expect(auditLogger.getEvents()).toEqual([
      {
        attributes: {
          "PNC Response Time": expect.any(Number),
          "PNC Attempts Made": 1,
          "PNC Request Message": "1101ZD0100000410770Y",
          "PNC Request Type": "enquiry",
          "PNC Response Message": "PNC error, PNC error 2",
          sensitiveAttributes: "PNC Request Message,PNC Response Message"
        },
        category: "information",
        eventCode: "pnc.response-received",
        eventSource: "CorePhase1",
        eventType: "PNC Response received",
        timestamp: expect.anything()
      }
    ])
  })

  it("should generate audit log event when PNC query fails but now PNC errors are returned", async () => {
    mockedGet.mockRejectedValue(new Error("Network error"))

    const result = await pncGateway.query("dummy asn", "dummy correlation id", aho)

    expect(isError(result)).toBe(true)
    expect(auditLogger.getEvents()).toEqual([
      {
        attributes: {
          "PNC Response Time": expect.any(Number),
          "PNC Attempts Made": 1,
          "PNC Request Message": "1101ZD0100000410770Y",
          "PNC Request Type": "enquiry",
          "PNC Response Message": "Network error",
          sensitiveAttributes: "PNC Request Message,PNC Response Message"
        },
        category: "information",
        eventCode: "pnc.response-received",
        eventSource: "CorePhase1",
        eventType: "PNC Response received",
        timestamp: expect.anything()
      }
    ])
  })
})
