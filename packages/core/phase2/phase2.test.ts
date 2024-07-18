import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import fs from "fs"
import MockDate from "mockdate"
import CoreAuditLogger from "../lib/CoreAuditLogger"
import parseAhoXml from "../lib/parse/parseAhoXml/parseAhoXml"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import { parsePncUpdateDataSetXml } from "./parse/parsePncUpdateDataSetXml"
import phase2Handler from "./phase2"

describe("Bichard Core Phase 2 processing logic", () => {
  const inputAhoMessage = fs.readFileSync("phase2/tests/fixtures/AnnotatedHO1.xml").toString()
  const inputAho = parseAhoXml(inputAhoMessage) as AnnotatedHearingOutcome

  const inputPncUpdateDatasetMessage = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet1.xml").toString()
  const inputPncUpdateDataset = parsePncUpdateDataSetXml(inputPncUpdateDatasetMessage) as PncUpdateDataset

  let auditLogger: CoreAuditLogger
  const mockedDate = new Date()

  beforeEach(() => {
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase1)
    MockDate.set(mockedDate)
  })

  describe("when an incoming message is an AHO", () => {
    it("should return an object with the correct attributes", () => {
      const result = phase2Handler(inputAho, auditLogger)

      expect(result).toHaveProperty("auditLogEvents")
      expect(result).toHaveProperty("outputMessage")
      expect(result).toHaveProperty("triggers")
    })

    it("should return a PncUpdateDataset message with a single DISARR", () => {
      const result = phase2Handler(inputAho, auditLogger)

      expect(result.outputMessage.PncOperations).toHaveLength(1)
      expect(result.outputMessage.PncOperations[0].code).toBe("DISARR")
    })
  })

  describe("when an incoming message is a PncUpdateDataset", () => {
    it("should return an object with the correct attributes", () => {
      const result = phase2Handler(inputPncUpdateDataset, auditLogger)

      expect(result).toHaveProperty("auditLogEvents")
      expect(result).toHaveProperty("outputMessage")
      expect(result).toHaveProperty("triggers")
    })
  })
})
