import axios from "axios"

import type PoliceApiError from "../PoliceApiError"

import generateAhoFromOffenceList from "../../../phase2/tests/fixtures/helpers/generateAhoFromOffenceList"
import ledsAsnQueryResponse from "../../../tests/fixtures/leds-asn-query-response-001.json"
import LedsGateway from "./LedsGateway"

const aho = generateAhoFromOffenceList([])

describe("LedsGateway", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("query", () => {
    let ledsGateway: LedsGateway

    beforeEach(() => {
      ledsGateway = new LedsGateway({ url: "https://dummy" })
    })

    it("should return police query result and update query time", async () => {
      jest.spyOn(axios, "post").mockResolvedValue({
        status: 200,
        data: ledsAsnQueryResponse
      })

      expect(ledsGateway.queryTime).toBeUndefined()

      const result = await ledsGateway.query("dummy-asn", "dummy-id", aho)

      expect(result).toMatchSnapshot()
      expect(ledsGateway.queryTime).toBeDefined()
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
})
