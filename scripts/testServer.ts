/* eslint-disable import/no-extraneous-dependencies */
import CoreAuditLogger from "core/common/CoreAuditLogger"
import parseSpiResult from "core/phase1/src/parse/parseSpiResult"
import transformSpiToAho from "core/phase1/src/parse/transformSpiToAho"
import CoreHandler from "core/phase1/src/phase1"
import type { PncQueryResult } from "core/phase1/src/types/PncQueryResult"
import MockPncGateway from "core/phase1/tests/helpers/MockPncGateway"
import express from "express"

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

app.post("/", async (req, res) => {
  const testData = JSON.parse(req.body.toString(), formatter) as TestInput
  const pncGateway = new MockPncGateway(testData.pncQueryResult)
  const auditLogger = new CoreAuditLogger()

  const inputSpi = parseSpiResult(testData.inputMessage)
  const inputAho = transformSpiToAho(inputSpi)

  try {
    const coreResult = await CoreHandler(inputAho, pncGateway, auditLogger)
    res.json(coreResult)
  } catch (e) {
    console.error(e)
    return 500
  }
})

app.listen(port, () => {
  console.log(`Bichard Core test server listening on port ${port}`)
})
