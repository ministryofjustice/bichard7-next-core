import fs from "fs"
import generateMockPncQueryResult from "../tests/helpers/generateMockPncQueryResult"
import MockPncGateway from "../tests/helpers/MockPncGateway"
import handler from "./index"
import CoreAuditLogger from "./lib/CoreAuditLogger"

describe("Bichard Core processing logic", () => {
  it("should return an object with the correct attributes", () => {
    const inputMessage = fs.readFileSync("test-data/input-message-001.xml").toString()
    const mockPncGateway = new MockPncGateway(generateMockPncQueryResult(inputMessage))
    const auditLogger = new CoreAuditLogger()
    const result = handler(inputMessage, mockPncGateway, auditLogger)
    expect(result).toHaveProperty("triggers")
    expect(result).toHaveProperty("hearingOutcome")
    expect(result).toHaveProperty("events")
  })
})
