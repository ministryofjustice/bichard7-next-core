/* eslint-disable import/no-extraneous-dependencies */
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import express from "express"
import MockPncGateway from "../comparison/lib/MockPncGateway"
import CoreAuditLogger from "../lib/CoreAuditLogger"
import CorePhase1 from "../phase1/phase1"
import CorePhase2 from "../phase2/phase2"
import type { PncQueryResult } from "../types/PncQueryResult"
import Phase from "../types/Phase"
import parseIncomingMessage from "../comparison/lib/parseIncomingMessage"

const app = express()
app.use(express.raw({ type: "*/*", limit: 10_000_000 }))
const port = 6000

type TestInput = {
  inputMessage: string
  pncQueryResult?: PncQueryResult
  phase: Phase
}

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/
function formatter(_: string, value: unknown) {
  if (typeof value === "string" && dateFormat.test(value)) {
    return new Date(value)
  }

  return value
}

app.post("/", async (req, res) => {
  const { pncQueryResult, inputMessage, phase } = JSON.parse(req.body.toString(), formatter) as TestInput

  const auditLogEventSource =
    phase === Phase.HEARING_OUTCOME ? AuditLogEventSource.CorePhase1 : AuditLogEventSource.CorePhase2
  const auditLogger = new CoreAuditLogger(auditLogEventSource)

  const { message: incomingMessage } = parseIncomingMessage(inputMessage)

  try {
    if (phase === Phase.HEARING_OUTCOME) {
      const pncGateway = new MockPncGateway(pncQueryResult)

      const corePhase1Result = await CorePhase1(incomingMessage, pncGateway, auditLogger)

      return res.json(corePhase1Result)
    }

    const corePhase2Result = CorePhase2(incomingMessage, auditLogger)

    return res.json(corePhase2Result)
  } catch (e) {
    console.error(e)
    return 500
  }
})

app.listen(port, () => {
  console.log(`Bichard Core test server listening on port ${port}`)
})
