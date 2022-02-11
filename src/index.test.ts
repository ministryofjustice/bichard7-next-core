import handler from "./index"
import fs from "fs"

describe("Bichard Core processing logic", () => {
  it("should return an object with the correct attributes", () => {
    const inputMessage = fs.readFileSync("test-data/input-message-001.xml").toString()
    const result = handler(inputMessage)
    expect(result).toHaveProperty("triggers")
    expect(result).toHaveProperty("exceptions")
  })
})
