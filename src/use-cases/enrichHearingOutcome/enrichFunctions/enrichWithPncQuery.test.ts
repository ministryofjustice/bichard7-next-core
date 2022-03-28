import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type PncGateway from "src/types/PncGateway"
import parseSpiResult from "src/use-cases/parseSpiResult"
import transformSpiToAho from "src/use-cases/transformSpiToAho"
import generateMessage from "../../../../tests/helpers/generateMessage"
import generateMockPncQueryResult from "../../../../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../../../../tests/helpers/MockPncGateway"
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
    const result = enrichWithPncQuery(aho, pncGateway)
    expect(result.PncQuery).toMatchSnapshot()
  })

  it("should populate the offence titles from PNC query", () => {
    const result = enrichWithPncQuery(aho, pncGateway)
    const offences = result.PncQuery?.cases![0].offences

    expect(offences).toHaveLength(2)
    expect(offences![0].offence.title).toBe("POSSESSING PART OF DEAD BADGER")
    expect(offences![1].offence.title).toBe("POSSESSING THING DERIVED FROM DEAD BADGER")
  })
})
