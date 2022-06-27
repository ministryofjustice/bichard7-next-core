/* eslint-disable import/no-extraneous-dependencies */
import express from "express"
import CoreHandler from "../src"
import type { PncQueryResult } from "../src/types/PncQueryResult"
import MockPncGateway from "../tests/helpers/MockPncGateway"

const app = express()
app.use(express.raw({ type: "*/*", limit: 10_000_000 }))
const port = 6000

type TestInput = {
  inputMessage: string
  pncQueryResult?: PncQueryResult
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/
function formatter(_: string, value: unknown) {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value)
  }

  return value
}

app.post("/", (req, res) => {
  const testData = JSON.parse(req.body.toString(), formatter) as TestInput
  const pncGateway = new MockPncGateway(testData.pncQueryResult)
  const coreResult = CoreHandler(testData.inputMessage, pncGateway)
  res.json(coreResult)
})

app.listen(port, () => {
  console.log(`Bichard Core test server listening on port ${port}`)
})
