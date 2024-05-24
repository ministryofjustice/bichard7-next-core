import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import MockDate from "mockdate"
import CoreAuditLogger from "../../lib/CoreAuditLogger"
import generateFakePncUpdateDataset from "../tests/fixtures/helpers/generateFakePncUpdateDataset"
import phase2PncUpdateDataset from "./phase2PncUpdateDataset"

describe("phase2PncUpdateDataset", () => {
  beforeEach(() => {
    MockDate.reset()
  })

  it("should generate hearing-outcome.resubmitted-received event", () => {
    const date = new Date()
    MockDate.set(date)
    const pncUpdateDataset = generateFakePncUpdateDataset({})
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)

    const result = phase2PncUpdateDataset(pncUpdateDataset, auditLogger)

    expect(result.auditLogEvents).toContainEqual({
      attributes: {},
      category: "information",
      eventCode: "hearing-outcome.resubmitted-received",
      eventSource: "CorePhase2",
      eventType: "Resubmitted hearing outcome received",
      timestamp: date
    })
  })
})
