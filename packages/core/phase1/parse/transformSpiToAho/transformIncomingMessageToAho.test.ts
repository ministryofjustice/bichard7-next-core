import fs from "fs"
import transformIncomingMessageToAho from "./transformIncomingMessageToAho"

it("should transform the incoming message to an AHO", () => {
  const inputMessage = String(fs.readFileSync("phase1/tests/fixtures/input-message-routedata-001.xml"))

  const aho = transformIncomingMessageToAho(inputMessage)

  expect(aho).toMatchSnapshot()
})
