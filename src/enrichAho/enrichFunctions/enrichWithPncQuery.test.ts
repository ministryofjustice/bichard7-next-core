import parseSpiResult from "../../parse/parseSpiResult"
import transformSpiToAho from "../../parse/transformSpiToAho"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type PncGateway from "../../types/PncGateway"
import generateMessage from "../../../tests/helpers/generateMessage"
import generateMockPncQueryResult from "../../../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../../../tests/helpers/MockPncGateway"
import enrichWithPncQuery from "./enrichWithPncQuery"

describe("enrichWithQuery()", () => {
  let incomingMessage: string
  let aho: AnnotatedHearingOutcome
  let pncGateway: PncGateway

  beforeEach(() => {
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

  it("should enrich AHO with results from PNC query", () => {
    expect(aho.PncQuery).toBeUndefined()
    const resultAho = enrichWithPncQuery(aho, pncGateway)
    expect(resultAho.PncQuery).toBe(pncGateway.query("MockASN"))
  })

  it("should populate the court case offence titles from PNC query", () => {
    const result = enrichWithPncQuery(aho, pncGateway)
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
    const result = enrichWithPncQuery(aho, pncGateway)
    const offences = result.PncQuery?.penaltyCases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })

  it("should set the PNC query date element to undefined if it is not set", () => {
    expect(aho.PncQueryDate).toBeUndefined()
    const resultAho = enrichWithPncQuery(aho, pncGateway)
    expect(resultAho.PncQueryDate).toBeUndefined()
  })
})
