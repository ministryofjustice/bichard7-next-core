import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "node:crypto"
import { fetch } from "undici"

import type DisposalUpdatedPncUpdateRequest from "../../../phase3/types/DisposalUpdatedPncUpdateRequest"
import type NormalDisposalPncUpdateRequest from "../../../phase3/types/NormalDisposalPncUpdateRequest"
import type RemandPncUpdateRequest from "../../../phase3/types/RemandPncUpdateRequest"
import type SentenceDeferredPncUpdateRequest from "../../../phase3/types/SentenceDeferredPncUpdateRequest"
import type AuditLogger from "../../../types/AuditLogger"
import type PoliceApiError from "../PoliceApiError"

import generateAhoFromOffenceList from "../../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generateFakePncUpdateDataset from "../../../phase2/tests/fixtures/helpers/generateFakePncUpdateDataset"
import { PncUpdateType } from "../../../phase3/types/HearingDetails"
import ledsAsnQueryResponse from "../../../tests/fixtures/leds-asn-query-response-001.json"
import LedsActionCode from "../../../types/leds/LedsActionCode"
import LedsAuthentication from "../../../types/leds/LedsAuthentication"
import CoreAuditLogger from "../../auditLog/CoreAuditLogger"
import generateRequestHeaders from "./generateRequestHeaders"
import LedsGateway from "./LedsGateway"

jest.mock("undici", () => ({
  ...jest.requireActual("undici"),
  fetch: jest.fn()
}))

const fetchMock = fetch as jest.Mock

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const auditLogEventMatchers = [
  {
    attributes: {
      "Request Headers": {
        "X-Leds-Activity-Flow-Id": expect.stringMatching(uuidPattern),
        "X-Leds-Application-Datetime": expect.any(String),
        "X-Leds-Reference-Id": expect.stringMatching(uuidPattern),
        "X-Leds-Session-Id": expect.stringMatching(uuidPattern),
        "X-Leds-Correlation-Id": expect.stringMatching(uuidPattern)
      },
      "Request URL": expect.stringMatching(/https:\/\/dummy\/person-services\/v1\/.*/),
      "Response Time": expect.any(Number)
    },
    timestamp: expect.any(Date)
  }
]

class FakeLedsAuthentication extends LedsAuthentication {
  static newInstance = () => new FakeLedsAuthentication()

  generateBearerToken() {
    return Promise.resolve("DummyAuthToken")
  }
}

const aho = generateAhoFromOffenceList([])

const pncUpdateDataset = generateFakePncUpdateDataset()
pncUpdateDataset.PncQuery!.personId = randomUUID()
pncUpdateDataset.PncQuery!.reportId = randomUUID()
pncUpdateDataset.PncQuery!.courtCases!.forEach((courtCase) => {
  courtCase.courtCaseId = "3f61e151-1516-402e-8de6-6461d22b3c8c"
  courtCase.offences.forEach((offence) => {
    offence.offence.offenceId = "fb9dadf2-2b81-45eb-93cd-87602f093571"
  })
})

const generateRemandRequest = (): RemandPncUpdateRequest => ({
  operation: PncOperation.REMAND,
  request: {
    croNumber: null,
    forceStationCode: "02YZ",
    pncCheckName: "FIRST NAME LAST NAME",
    pncIdentifier: pncUpdateDataset.PncQuery!.personId!,
    arrestSummonsNumber: "11/01ZD/01/410780J",
    hearingDate: "05122024",
    nextHearingDate: "11122024",
    pncRemandStatus: "B",
    remandLocationCourt: "1234",
    psaCourtCode: "9998",
    courtNameType1: "Magistrates' Courts London Croydon MCA",
    courtNameType2: "Magistrates' Courts London Croydon MCA",
    localAuthorityCode: "0000",
    bailConditions: ["This is a dummy bail condition."]
  }
})

const generateExpectedHeaders = (correlationId: string, actionCode: LedsActionCode) => ({
  ...generateRequestHeaders(correlationId, actionCode, "dummy"),
  Authorization: expect.anything(),
  "X-Leds-Session-Id": expect.anything(),
  "X-Leds-Application-Datetime": expect.anything(),
  "X-Leds-Activity-Flow-Id": expect.anything(),
  "X-Leds-Reference-Id": expect.anything()
})

describe("LedsGateway", () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })
  let auditLogger: AuditLogger
  let ledsGateway: LedsGateway

  beforeEach(() => {
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
    ledsGateway = new LedsGateway(
      { url: "https://dummy", authentication: FakeLedsAuthentication.newInstance() },
      auditLogger
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("query", () => {
    it("should return police query result and update query time", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(ledsAsnQueryResponse)
      } as any)
      expect(ledsGateway.queryTime).toBeUndefined()

      const correlationId = randomUUID()
      const result = await ledsGateway.query("dummy-asn", correlationId, aho)

      expect(isError(result)).toBe(false)
      expect(result).toMatchSnapshot("Query Result")
      expect(ledsGateway.queryTime).toBeDefined()
      expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
        ...generateExpectedHeaders(correlationId, LedsActionCode.QueryByAsn),
        "Content-Type": "application/json"
      })
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should return an error when api call fails", async () => {
      fetchMock.mockRejectedValue(new Error("API call failed."))

      const result = (await ledsGateway.query("dummy-asn", randomUUID(), aho)) as PoliceApiError

      expect(result?.messages).toEqual(["API call failed."])
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should return an error when http status code is not 200 and response contains LEDS errors", async () => {
      fetchMock.mockResolvedValue({
        status: 501,
        json: jest.fn().mockResolvedValue({
          status: 501,
          title: "dummy title",
          type: "unprocessable/not-allowed",
          details: "dummy details",
          instance: "dummy instance",
          leds: {
            errors: [{ message: "dummy error message 1" }, { message: "dummy error message 2" }]
          }
        })
      } as any)

      const result = (await ledsGateway.query("dummy-asn", randomUUID(), aho)) as PoliceApiError

      expect(isError(result)).toBe(true)
      expect(result?.messages).toEqual(["dummy error message 1", "dummy error message 2"])
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should return an error when http status code is not 200 and response does not contain LEDS errors", async () => {
      fetchMock.mockResolvedValue({
        status: 501,
        json: jest.fn().mockResolvedValue({
          randomField: "randomValue"
        })
      } as any)

      const result = (await ledsGateway.query("dummy-asn", randomUUID(), aho)) as PoliceApiError

      expect(isError(result)).toBe(true)
      expect(result?.messages).toEqual(["ASN query failed with status code 501."])
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should return an error when http status code is 200 but data is in wrong format", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue({
          randomField: "randomValue"
        })
      } as any)

      const result = (await ledsGateway.query("dummy-asn", randomUUID(), aho)) as PoliceApiError

      expect(isError(result)).toBe(true)
      expect(result?.messages).toEqual(["Couldn't parse LEDS query response."])
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })
  })

  describe("update", () => {
    it("should successfully update when operation is remand", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({
          id: "de765c89-b99d-4116-b282-64a03b242043"
        })
      } as unknown as Response)

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = await ledsGateway.update(request, correlationId, pncUpdateDataset)

      expect(result).toBeUndefined()
      expect(fetchMock.mock.calls[0][0]).toBe(
        `https://dummy/person-services/v1/people/${pncUpdateDataset.PncQuery!.personId}/arrest-reports/${pncUpdateDataset.PncQuery!.reportId}/basic-remands`
      )
      expect(JSON.parse(JSON.stringify(fetchMock.mock.calls[0][1]))).toEqual({
        ownerCode: "02YZ",
        longPersonUrn: "2000/410770Y",
        remandDate: "2024-12-05",
        appearanceResult: "remanded-on-bail",
        bailConditions: ["This is a dummy bail condition.\n\n\n"],
        currentAppearance: { court: { courtIdentityType: "code", courtCode: "1234" } },
        nextAppearance: {
          date: "2024-12-11",
          court: { courtIdentityType: "name", courtName: "Magistrates' Courts London Croydon MCA" }
        }
      })
      expect(fetchMock.mock.calls[0][1]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddRemand)
      )
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should successfully update when operation is add disposal results", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({
          id: "d5f0300e-3079-4923-95a3-d4f4a6c60cd9"
        })
      } as unknown as Response)

      const request: NormalDisposalPncUpdateRequest = {
        operation: PncOperation.NORMAL_DISPOSAL,
        request: {
          pncCheckName: "FIRST NAME LAST NAME",
          pncIdentifier: pncUpdateDataset.PncQuery!.personId!,
          arrestSummonsNumber: null,
          arrestsAdjudicationsAndDisposals: [],
          courtCaseReferenceNumber: pncUpdateDataset.PncQuery!.courtCases![0].courtCaseReference,
          courtHouseName: "",
          croNumber: null,
          dateOfHearing: "05122024",
          forceStationCode: "02YZ",
          generatedPNCFilename: "",
          hearingsAdjudicationsAndDisposals: [
            {
              courtOffenceSequenceNumber: "1",
              offenceReason: "RT88191",
              type: PncUpdateType.ORDINARY
            },
            {
              hearingDate: "",
              numberOffencesTakenIntoAccount: "0000",
              pleaStatus: "",
              type: PncUpdateType.ADJUDICATION,
              verdict: ""
            },
            {
              disposalQualifiers: "",
              disposalQuantity: "                      00",
              disposalText: "",
              disposalType: "2059",
              type: PncUpdateType.DISPOSAL
            }
          ],
          pendingCourtDate: "11122024",
          pendingCourtHouseName: "",
          pendingPsaCourtCode: "2575",
          preTrialIssuesUniqueReferenceNumber: null,
          psaCourtCode: "1234"
        }
      }

      const correlationId = randomUUID()
      const result = await ledsGateway.update(request, correlationId, pncUpdateDataset)

      expect(result).toBeUndefined()
      expect(fetchMock.mock.calls[0][0]).toBe(
        `https://dummy/person-services/v1/people/${pncUpdateDataset.PncQuery!.personId}/disposals/${pncUpdateDataset.PncQuery!.courtCases![0].courtCaseId}/court-case-disposal-result`
      )
      expect(JSON.parse(JSON.stringify(fetchMock.mock.calls[0][1]))).toEqual({
        ownerCode: "02YZ",
        longPersonUrn: "2000/410770Y",
        courtCaseReference: "97/1626/008395Q",
        court: { courtIdentityType: "code", courtCode: "1234" },
        dateOfConviction: "2024-12-05",
        defendant: { defendantType: "individual", defendantFirstNames: ["TRPSTWO"], defendantLastName: "TRTHREE" },
        carryForward: { appearanceDate: "2024-12-11", court: { courtIdentityType: "code", courtCode: "2575" } },
        offences: [
          {
            courtOffenceSequenceNumber: 1,
            cjsOffenceCode: "RT88191",
            offenceTic: 0,
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[0].offence.offenceId,
            disposalResults: [
              {
                disposalCode: 2059
              }
            ]
          }
        ]
      })
      expect(fetchMock.mock.calls[0][1]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddDisposalResults)
      )
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should successfully update when operation is subsequently varied", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({
          id: "061a236c-ecdc-48d1-81b2-f3f099a35991"
        })
      } as unknown as Response)

      const request: DisposalUpdatedPncUpdateRequest = {
        operation: PncOperation.DISPOSAL_UPDATED,
        request: {
          courtCaseReferenceNumber: pncUpdateDataset.PncQuery!.courtCases![0].courtCaseReference,
          courtCode: "2575",
          croNumber: null,
          forceStationCode: "01YZ",
          hearingDate: "19122023",
          hearingDetails: [
            {
              courtOffenceSequenceNumber: "001",
              offenceReason: "FA06001",
              type: PncUpdateType.ORDINARY
            },
            {
              hearingDate: "19122023",
              numberOffencesTakenIntoAccount: "0000",
              pleaStatus: "GUILTY",
              type: PncUpdateType.ADJUDICATION,
              verdict: "GUILTY"
            },
            {
              disposalQualifiers: "",
              disposalQuantity: "                      00",
              disposalText: "FAILED TO APPEAR WARRANT ISSUED",
              disposalType: "4004",
              type: PncUpdateType.DISPOSAL
            },
            {
              courtOffenceSequenceNumber: "002",
              offenceReason: "FA06001",
              type: PncUpdateType.ORDINARY
            },
            {
              hearingDate: "19122023",
              numberOffencesTakenIntoAccount: "0000",
              pleaStatus: "GUILTY",
              type: PncUpdateType.ADJUDICATION,
              verdict: "GUILTY"
            },
            {
              disposalQualifiers: "",
              disposalQuantity: "                      00",
              disposalText: "FAILED TO APPEAR WARRANT ISSUED",
              disposalType: "4004",
              type: PncUpdateType.DISPOSAL
            }
          ],
          hearingType: "V",
          pncCheckName: "COLE",
          pncIdentifier: pncUpdateDataset.PncQuery!.pncId
        }
      }

      const correlationId = randomUUID()
      const result = await ledsGateway.update(request, correlationId, pncUpdateDataset)

      expect(result).toBeUndefined()
      expect(fetchMock.mock.calls[0][0]).toBe(
        `https://dummy/person-services/v1/people/${pncUpdateDataset.PncQuery!.personId}/disposals/${pncUpdateDataset.PncQuery!.courtCases![0].courtCaseId}/court-case-subsequent-disposal-results`
      )
      expect(JSON.parse(JSON.stringify(fetchMock.mock.calls[0][1]))).toEqual({
        ownerCode: "01YZ",
        longPersonUrn: "2000/410770Y",
        courtCaseReference: "97/1626/008395Q",
        court: { courtIdentityType: "code", courtCode: "2575" },
        appearanceDate: "2023-12-19",
        reasonForAppearance: "Subsequently Varied",
        offences: [
          {
            courtOffenceSequenceNumber: 1,
            cjsOffenceCode: "FA06001",
            plea: "Guilty",
            adjudication: "Guilty",
            dateOfSentence: "2023-12-19",
            offenceTic: 0,
            disposalResults: [
              {
                disposalCode: 4004,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED"
              }
            ],
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[0].offence.offenceId
          },
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "FA06001",
            plea: "Guilty",
            adjudication: "Guilty",
            dateOfSentence: "2023-12-19",
            offenceTic: 0,
            disposalResults: [
              {
                disposalCode: 4004,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED"
              }
            ],
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[1].offence.offenceId
          }
        ]
      })
      expect(fetchMock.mock.calls[0][1]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddSubsequentDisposalResults)
      )
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should successfully update when operation is sentence deferred", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue({
          id: "fed86d18-c3de-4013-93f0-54fe1571ed13"
        })
      } as unknown as Response)

      const request: SentenceDeferredPncUpdateRequest = {
        operation: PncOperation.SENTENCE_DEFERRED,
        request: {
          courtCaseReferenceNumber: pncUpdateDataset.PncQuery!.courtCases![0].courtCaseReference,
          courtCode: "2575",
          croNumber: null,
          forceStationCode: "01YZ",
          hearingDate: "19122023",
          hearingDetails: [
            {
              courtOffenceSequenceNumber: "001",
              offenceReason: "FA06001",
              type: PncUpdateType.ORDINARY
            },
            {
              disposalQualifiers: "",
              disposalQuantity: "                      00",
              disposalText: "FAILED TO APPEAR WARRANT ISSUED",
              disposalType: "4004",
              type: PncUpdateType.DISPOSAL
            },
            {
              courtOffenceSequenceNumber: "002",
              offenceReason: "FA06001",
              type: PncUpdateType.ORDINARY
            },
            {
              disposalQualifiers: "",
              disposalQuantity: "                      00",
              disposalText: "FAILED TO APPEAR WARRANT ISSUED",
              disposalType: "4004",
              type: PncUpdateType.DISPOSAL
            }
          ],
          hearingType: "D",
          pncCheckName: "COLE",
          pncIdentifier: pncUpdateDataset.PncQuery!.pncId
        }
      }

      const correlationId = randomUUID()
      const result = await ledsGateway.update(request, correlationId, pncUpdateDataset)

      expect(result).toBeUndefined()
      expect(fetchMock.mock.calls[0][0]).toBe(
        `https://dummy/person-services/v1/people/${pncUpdateDataset.PncQuery!.personId}/disposals/${pncUpdateDataset.PncQuery!.courtCases![0].courtCaseId}/court-case-subsequent-disposal-results`
      )
      expect(JSON.parse(JSON.stringify(fetchMock.mock.calls[0][1]))).toEqual({
        ownerCode: "01YZ",
        longPersonUrn: "2000/410770Y",
        courtCaseReference: "97/1626/008395Q",
        court: { courtIdentityType: "code", courtCode: "2575" },
        appearanceDate: "2023-12-19",
        reasonForAppearance: "Sentence Deferred",
        offences: [
          {
            courtOffenceSequenceNumber: 1,
            cjsOffenceCode: "FA06001",
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[0].offence.offenceId,
            disposalResults: [
              {
                disposalCode: 4004,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED"
              }
            ]
          },
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "FA06001",
            disposalResults: [
              {
                disposalCode: 4004,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED"
              }
            ],
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[1].offence.offenceId
          }
        ]
      })
      expect(fetchMock.mock.calls[0][1]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddSubsequentDisposalResults)
      )
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should return an error when api call fails", async () => {
      fetchMock.mockRejectedValue(Error("Dummy update: API call failed."))

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = (await ledsGateway.update(request, correlationId, pncUpdateDataset)) as PoliceApiError

      expect(result?.messages).toEqual(["Dummy update: API call failed."])
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should return an error when http status code is not 200 and response contains LEDS errors", async () => {
      fetchMock.mockResolvedValue({
        status: 501,
        json: jest.fn().mockResolvedValue({
          status: 501,
          title: "dummy title",
          type: "unprocessable/not-allowed",
          details: "dummy details",
          instance: "dummy instance",
          leds: {
            errors: [
              {
                message: "dummy error message 1"
              },
              {
                message: "dummy error message 2"
              }
            ]
          }
        })
      } as any)

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = (await ledsGateway.update(request, correlationId, pncUpdateDataset)) as PoliceApiError

      expect(result?.messages).toEqual(["dummy error message 1", "dummy error message 2"])
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })

    it("should return an error when http status code is not 200 and response does not contain LEDS errors", async () => {
      fetchMock.mockResolvedValue({
        status: 501,
        json: jest.fn().mockResolvedValue({
          randomField: "randomValue"
        })
      } as any)

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = (await ledsGateway.update(request, correlationId, pncUpdateDataset)) as PoliceApiError

      expect(result?.messages).toEqual(["Update failed with status code 501."])
      expect(auditLogger.getEvents()).toMatchSnapshot(auditLogEventMatchers, "Audit Log Events")
    })
  })
})
