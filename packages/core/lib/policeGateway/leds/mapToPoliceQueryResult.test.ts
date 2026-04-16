import type { AsnQueryResponse } from "../../../types/leds/AsnQueryResponse"

import ledsAsnQueryResponse from "../../../tests/fixtures/leds-asn-query-response-001.json"
import mapToPoliceQueryResult from "./mapToPoliceQueryResult"

describe("mapToPoliceQueryResult", () => {
  it("should map LEDS ASN query response to police query result", () => {
    const policeQueryResult = mapToPoliceQueryResult(ledsAsnQueryResponse as AsnQueryResponse, "dummy checkname")

    expect(policeQueryResult).toEqual({
      forceStationCode: "01ZD",
      checkName: "dummy checkname",
      personId: "5c6ab813-35b6-44de-817c-f41de14c9526",
      reportId: "1aaa5c44-4fca-4af7-a558-9c6148a77c4c",
      pncId: "201950/0001581C",
      courtCases: [
        {
          courtCaseId: "bddbd0d2-232d-47b3-896a-ce7be613b07c",
          courtCaseReference: "26/9998/000826X",
          offences: [
            {
              offence: {
                offenceId: "9faec803-2428-496b-a670-68e15a7849bb",
                acpoOffenceCode: "2.1.4.1",
                cjsOffenceCode: "SX03001",
                startDate: new Date("2010-11-28T00:00:00.000Z"),
                startTime: undefined,
                endDate: undefined,
                endTime: undefined,
                qualifier1: undefined,
                qualifier2: undefined,
                title: undefined,
                sequenceNumber: 3
              },
              adjudication: {
                verdict: "GUILTY",
                plea: "NOT GUILTY",
                sentenceDate: new Date("2011-09-26T00:00:00.000Z"),
                offenceTICNumber: 0,
                weedFlag: undefined
              },
              disposals: [
                {
                  disposalId: "dbf6c8ea-79f4-4b91-9b97-2720019b87b6",
                  qtyDate: undefined,
                  qtyDuration: undefined,
                  qtyMonetaryValue: undefined,
                  qtyUnitsFined: undefined,
                  qualifiers: "S       Y999",
                  text: undefined,
                  type: 3052
                }
              ]
            },
            {
              offence: {
                offenceId: "ba5a7edb-a9ae-4612-a22b-be2166a66b79",
                acpoOffenceCode: "12.15.13.1",
                cjsOffenceCode: "RT88191",
                startDate: new Date("2010-11-28T00:00:00.000Z"),
                startTime: undefined,
                endDate: undefined,
                endTime: undefined,
                qualifier1: undefined,
                qualifier2: undefined,
                title: undefined,
                sequenceNumber: 2
              },
              adjudication: {
                verdict: "GUILTY",
                plea: "NOT GUILTY",
                sentenceDate: new Date("2011-09-26T00:00:00.000Z"),
                offenceTICNumber: 0,
                weedFlag: undefined
              },
              disposals: [
                {
                  disposalId: "74260b90-e55e-4748-9133-57c09634e953",
                  qtyDate: "2011-10-12",
                  qtyDuration: "W5",
                  qtyMonetaryValue: "100.00",
                  qtyUnitsFined: undefined,
                  qualifiers: "ABB     M12",
                  text: undefined,
                  type: 1015
                }
              ]
            },
            {
              offence: {
                offenceId: "101e18ac-f0df-462c-841b-1eaed0975801",
                acpoOffenceCode: "2.1.4.1",
                cjsOffenceCode: "SX03001A",
                startDate: new Date("2010-11-28T00:00:00.000Z"),
                startTime: "10:00",
                endDate: new Date("2010-11-29T00:00:00.000Z"),
                endTime: "12:30",
                qualifier1: "AT",
                qualifier2: undefined,
                title: undefined,
                sequenceNumber: 1
              },
              adjudication: {
                verdict: "GUILTY",
                plea: "NOT GUILTY",
                sentenceDate: new Date("2011-09-26T00:00:00.000Z"),
                offenceTICNumber: 0,
                weedFlag: undefined
              },
              disposals: [
                {
                  disposalId: "a8a7be2a-5d2e-4643-9665-029c66dc0c46",
                  qtyDate: undefined,
                  qtyDuration: undefined,
                  qtyMonetaryValue: undefined,
                  qtyUnitsFined: undefined,
                  qualifiers: undefined,
                  text: undefined,
                  type: 3078
                }
              ]
            }
          ],
          crimeOffenceReference: undefined
        }
      ],
      croNumber: undefined,
      penaltyCases: undefined
    })
  })
})
