import fs from "fs"
import generateMockPncQueryResult from "../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import handler from "./index"

describe("Bichard Core processing logic", () => {
  it("should return an object with the correct attributes", () => {
    const inputMessage = fs.readFileSync("test-data/input-message-001.xml").toString()
    const mockPncGateway = new MockPncGateway(generateMockPncQueryResult(inputMessage))
    const result = handler(inputMessage, mockPncGateway)
    expect(result).toHaveProperty("triggers")
    expect(result).toHaveProperty("hearingOutcome")
  })
})
