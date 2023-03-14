import type { PncQueryResult } from "../../src/types/PncQueryResult"
import { mockEnquiryFromPncResult } from "./mockRecordInPnc"

const normaliseResponse = (response: string): string[] => response.split("\n").map((line) => line.trim())

describe("mockEnquiryFromPncResult()", () => {
  it("should generate the correct PNC XML from a given PncQueryResult", () => {
    const pncResult: PncQueryResult = {
      forceStationCode: "01ZD",
      checkName: "SEXOFFENCE",
      pncId: "2000/0448754K",
      courtCases: [
        {
          courtCaseReference: "97/1626/008395Q",
          offences: [
            {
              offence: {
                acpoOffenceCode: "12:15:24:1",
                cjsOffenceCode: "SX03001A",
                title: "Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003",
                sequenceNumber: 1,
                qualifier1: "",
                qualifier2: "",
                startDate: new Date("2010-11-28T00:00:00.000Z"),
                startTime: "00:00"
              }
            },
            {
              offence: {
                acpoOffenceCode: "12:15:24:1",
                cjsOffenceCode: "SX03001",
                title: "Rape a girl aged 13 / 14 / 15 - SOA 2003",
                sequenceNumber: 2,
                qualifier1: "",
                qualifier2: "",
                startDate: new Date("2010-11-28T00:00:00.000Z"),
                startTime: "00:00"
              }
            },
            {
              offence: {
                acpoOffenceCode: "12:15:24:1",
                cjsOffenceCode: "RT88191",
                title: "Use a motor vehicle on a road / public place without third party insurance",
                sequenceNumber: 3,
                qualifier1: "",
                qualifier2: "",
                startDate: new Date("2010-11-28T00:00:00.000Z"),
                startTime: "00:00"
              }
            }
          ]
        }
      ]
    }

    const outcome = mockEnquiryFromPncResult(pncResult)
    const normalisedOutcome = normaliseResponse(outcome.response)
    const expected = `<?XML VERSION=\"1.0\" STANDALONE=\"YES\"?>
        <CXE01>
          <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
          <ASI>
            <FSC>K01ZD</FSC>
            <IDS>K00/448754K SEXOFFENCE              </IDS>
            <CCR>K97/1626/8395Q                 </CCR>
            <COF>K001    12:15:24:1   SX03001A281120100000            </COF>
    <COF>K002    12:15:24:1   SX03001 281120100000            </COF>
    <COF>K003    12:15:24:1   RT88191 281120100000            </COF>
          </ASI>
          <GMT>000008073ENQR004540S</GMT>
        </CXE01>`
    const normalisedExpected = normaliseResponse(expected)

    // console.log(outcome)

    expect(normalisedOutcome).toEqual(normalisedExpected)
  })
})
