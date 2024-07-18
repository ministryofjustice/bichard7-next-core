/* eslint-disable import/no-extraneous-dependencies */
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import express from "express"
import MockPncGateway from "../comparison/lib/MockPncGateway"
import CoreAuditLogger from "../lib/CoreAuditLogger"
import parseSpiResult from "../lib/parse/parseSpiResult"
import transformSpiToAho from "../lib/parse/transformSpiToAho"
import CorePhase1 from "../phase1/phase1"
import type { PncQueryResult } from "../types/PncQueryResult"

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
  const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)

  const inputSpi = parseSpiResult(testData.inputMessage)
  const inputAho = transformSpiToAho(inputSpi)

  try {
    const coreResult = await CorePhase1(inputAho, pncGateway, auditLogger)
    res.json(coreResult)
  } catch (e) {
    console.error(e)
    return 500
  }
})

app.listen(port, () => {
  console.log(`Bichard Core test server listening on port ${port}`)
})
