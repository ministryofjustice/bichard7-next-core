import { PncOperation } from "@moj-bichard7/common/types/PncOperation"
import axios from "axios"
import { randomUUID } from "node:crypto"

import type DisposalUpdatedPncUpdateRequest from "../../../phase3/types/DisposalUpdatedPncUpdateRequest"
import type NormalDisposalPncUpdateRequest from "../../../phase3/types/NormalDisposalPncUpdateRequest"
import type RemandPncUpdateRequest from "../../../phase3/types/RemandPncUpdateRequest"
import type SentenceDeferredPncUpdateRequest from "../../../phase3/types/SentenceDeferredPncUpdateRequest"
import type PoliceApiError from "../PoliceApiError"

import generateAhoFromOffenceList from "../../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import generateFakePncUpdateDataset from "../../../phase2/tests/fixtures/helpers/generateFakePncUpdateDataset"
import { PncUpdateType } from "../../../phase3/types/HearingDetails"
import ledsAsnQueryResponse from "../../../tests/fixtures/leds-asn-query-response-001.json"
import LedsActionCode from "../../../types/leds/LedsActionCode"
import LedsAuthentication from "../../../types/leds/LedsAuthentication"
import generateRequestHeaders from "./generateRequestHeaders"
import LedsGateway from "./LedsGateway"

class FakeLedsAuthentication extends LedsAuthentication {
  generateBearerToken() {
    return Promise.resolve("DummyAuthToken")
  }
}

const aho = generateAhoFromOffenceList([])

const pncUpdateDataset = generateFakePncUpdateDataset()
pncUpdateDataset.PncQuery!.personId = randomUUID()
pncUpdateDataset.PncQuery!.reportId = randomUUID()
pncUpdateDataset.PncQuery!.courtCases!.forEach((courtCase) => {
  courtCase.courtCaseId = randomUUID()
  courtCase.offences.forEach((offence) => {
    offence.offence.offenceId = randomUUID()
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
  let ledsGateway: LedsGateway
  afterEach(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    ledsGateway = new LedsGateway({ url: "https://dummy", authentication: new FakeLedsAuthentication() })
  })

  describe("query", () => {
    it("should return police query result and update query time", async () => {
      const axiosMock = jest.spyOn(axios, "post").mockResolvedValue({
        status: 200,
        data: ledsAsnQueryResponse
      })

      expect(ledsGateway.queryTime).toBeUndefined()

      const result = await ledsGateway.query("dummy-asn", "dummy-id", aho)

      expect(result).toMatchSnapshot()
      expect(ledsGateway.queryTime).toBeDefined()
      expect(axiosMock.mock.calls[0][2]?.headers).toEqual(
        generateExpectedHeaders("dummy-id", LedsActionCode.QueryByAsn)
      )
    })

    it("should return an error when api call fails", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(Error("API call failed."))

      const result = (await ledsGateway.query("dummy-asn", "dummy-id", aho)) as PoliceApiError

      expect(result?.messages).toEqual(["API call failed."])
    })

    it("should return an error when http status code is not 200 and response contains LEDS errors", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({
        status: 501,
        data: {
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
        }
      })

      const result = (await ledsGateway.query("dummy-asn", "dummy-id", aho)) as PoliceApiError

      expect(result?.messages).toEqual(["dummy error message 1", "dummy error message 2"])
    })

    it("should return an error when http status code is not 200 and response does not contain LEDS errors", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({
        status: 501,
        data: {
          randomField: "randomVaule"
        }
      })

      const result = (await ledsGateway.query("dummy-asn", "dummy-id", aho)) as PoliceApiError

      expect(result?.messages).toEqual(["ASN query failed with status code 501."])
    })

    it("should return an error when http status code is 200 but data is in wrong format", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({
        status: 200,
        data: {
          randomField: "randomVaule"
        }
      })

      const result = (await ledsGateway.query("dummy-asn", "dummy-id", aho)) as PoliceApiError

      expect(result?.messages).toEqual(["Couldn't parse LEDS query response."])
    })
  })

  describe("update", () => {
    it("should successfully update when operation is remand", async () => {
      const axiosMock = jest.spyOn(axios, "post").mockResolvedValue({
        status: 201,
        data: { id: randomUUID() }
      })

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = await ledsGateway.update(request, correlationId, pncUpdateDataset)

      expect(result).toBeUndefined()
      expect(axiosMock.mock.calls[0][0]).toBe(
        `https://dummy/people/${pncUpdateDataset.PncQuery!.personId}/arrest-reports/${pncUpdateDataset.PncQuery!.reportId}/basic-remands`
      )
      expect(axiosMock.mock.calls[0][1]).toEqual({
        ownerCode: "02YZ",
        checkname: "FIRST NAME LAST NAME",
        personUrn: pncUpdateDataset.PncQuery!.personId,
        remandDate: "2024-12-05",
        appearanceResult: "remanded-on-bail",
        bailConditions: ["This is a dummy bail condition."],
        currentAppearance: { court: { courtIdentityType: "code", courtCode: "1234" } },
        nextAppearance: {
          date: "2024-12-11",
          court: { courtIdentityType: "name", courtName: "Magistrates' Courts London Croydon MCA" }
        }
      })
      expect(axiosMock.mock.calls[0][2]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddRemand)
      )
    })

    it("should successfully update when operation is add disposal results", async () => {
      const axiosMock = jest.spyOn(axios, "post").mockResolvedValue({
        status: 201,
        data: { id: randomUUID() }
      })

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
      expect(axiosMock.mock.calls[0][0]).toBe(
        `https://dummy/people/${pncUpdateDataset.PncQuery!.personId}/disposals/${pncUpdateDataset.PncQuery!.courtCases![0].courtCaseId}/court-case-disposal-result`
      )
      expect(axiosMock.mock.calls[0][1]).toEqual({
        ownerCode: "02YZ",
        personUrn: pncUpdateDataset.PncQuery!.personId,
        checkName: "FIRST NAME LAST NAME",
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
            disposalResults: [
              { disposalCode: 2059, disposalQualifiers: undefined, disposalText: "", disposalFine: { amount: 0 } }
            ],
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[0].offence.offenceId
          }
        ]
      })
      expect(axiosMock.mock.calls[0][2]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddDisposalResults)
      )
    })

    it("should successfully update when operation is subsequently varied", async () => {
      const axiosMock = jest.spyOn(axios, "post").mockResolvedValue({
        status: 201,
        data: { id: randomUUID() }
      })

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
      expect(axiosMock.mock.calls[0][0]).toBe(
        `https://dummy/people/${pncUpdateDataset.PncQuery!.personId}/disposals/${pncUpdateDataset.PncQuery!.courtCases![0].courtCaseId}/court-case-subsequent-disposal-results`
      )
      expect(axiosMock.mock.calls[0][1]).toEqual({
        ownerCode: "01YZ",
        personUrn: "2000/0410770Y",
        checkName: "COLE",
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
                disposalQualifiers: undefined,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED",
                disposalFine: { amount: 0 }
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
                disposalQualifiers: undefined,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED",
                disposalFine: { amount: 0 }
              }
            ],
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[1].offence.offenceId
          }
        ]
      })
      expect(axiosMock.mock.calls[0][2]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddSubsequentDisposalResults)
      )
    })

    it("should successfully update when operation is sentence deferred", async () => {
      const axiosMock = jest.spyOn(axios, "post").mockResolvedValue({
        status: 201,
        data: { id: randomUUID() }
      })

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
      expect(axiosMock.mock.calls[0][0]).toBe(
        `https://dummy/people/${pncUpdateDataset.PncQuery!.personId}/disposals/${pncUpdateDataset.PncQuery!.courtCases![0].courtCaseId}/court-case-subsequent-disposal-results`
      )
      expect(axiosMock.mock.calls[0][1]).toEqual({
        ownerCode: "01YZ",
        personUrn: pncUpdateDataset.PncQuery!.pncId,
        checkName: "COLE",
        courtCaseReference: "97/1626/008395Q",
        court: { courtIdentityType: "code", courtCode: "2575" },
        appearanceDate: "2023-12-19",
        reasonForAppearance: "Sentenced Deferred",
        offences: [
          {
            courtOffenceSequenceNumber: 1,
            cjsOffenceCode: "FA06001",
            disposalResults: [
              {
                disposalCode: 4004,
                disposalQualifiers: undefined,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED",
                disposalFine: { amount: 0 }
              }
            ],
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[0].offence.offenceId
          },
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "FA06001",
            disposalResults: [
              {
                disposalCode: 4004,
                disposalQualifiers: undefined,
                disposalText: "FAILED TO APPEAR WARRANT ISSUED",
                disposalFine: { amount: 0 }
              }
            ],
            offenceId: pncUpdateDataset.PncQuery!.courtCases![0].offences[1].offence.offenceId
          }
        ]
      })
      expect(axiosMock.mock.calls[0][2]?.headers).toEqual(
        generateExpectedHeaders(correlationId, LedsActionCode.AddSubsequentDisposalResults)
      )
    })

    it("should return an error when api call fails", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(Error("Dummy update: API call failed."))

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = (await ledsGateway.update(request, correlationId, pncUpdateDataset)) as PoliceApiError

      expect(result?.messages).toEqual(["Dummy update: API call failed."])
    })

    it("should return an error when http status code is not 200 and response contains LEDS errors", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({
        status: 501,
        data: {
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
        }
      })

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = (await ledsGateway.update(request, correlationId, pncUpdateDataset)) as PoliceApiError

      expect(result?.messages).toEqual(["dummy error message 1", "dummy error message 2"])
    })

    it("should return an error when http status code is not 200 and response does not contain LEDS errors", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({
        status: 501,
        data: {
          randomField: "randomVaule"
        }
      })

      const request: RemandPncUpdateRequest = generateRemandRequest()
      const correlationId = randomUUID()
      const result = (await ledsGateway.update(request, correlationId, pncUpdateDataset)) as PoliceApiError

      expect(result?.messages).toEqual(["Update failed with status code 501."])
    })
  })
})
