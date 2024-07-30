import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import fs from "fs"
import MockDate from "mockdate"
import CoreAuditLogger from "../lib/CoreAuditLogger"
import parseAhoXml from "../lib/parse/parseAhoXml/parseAhoXml"
import type { AnnotatedHearingOutcome, Offence, Result } from "../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"
import { parsePncUpdateDataSetXml } from "./parse/parsePncUpdateDataSetXml"
import phase2Handler from "./phase2"
import { Phase2ResultType } from "./types/Phase2Result"

describe("Bichard Core Phase 2 processing logic", () => {
  const inputAhoMessage = fs.readFileSync("phase2/tests/fixtures/AnnotatedHO1.xml").toString()
  const inputAho = parseAhoXml(inputAhoMessage) as AnnotatedHearingOutcome

  const inputPncUpdateDatasetMessage = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet1.xml").toString()
  const inputPncUpdateDataset = parsePncUpdateDataSetXml(inputPncUpdateDatasetMessage) as PncUpdateDataset

  let auditLogger: CoreAuditLogger
  const mockedDate = new Date()

  beforeEach(() => {
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
    MockDate.set(mockedDate)
  })

  it.each([
    { inputMessage: inputAho, type: "AHO" },
    { inputMessage: inputPncUpdateDataset, type: "PncUpdateDataset" }
  ])("returns successful result when an AINT case for $type", ({ inputMessage }) => {
    const aintCaseInputMessage = structuredClone(inputMessage)
    aintCaseInputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {
        CriminalProsecutionReference: {
          OffenceReason: { __type: "NationalOffenceReason" }
        },
        Result: [
          {
            PNCDisposalType: 1000,
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text.",
            ResultQualifierVariable: []
          } as unknown as Result
        ]
      }
    ] as Offence[]

    const result = phase2Handler(aintCaseInputMessage, auditLogger)

    expect(result.resultType).toBe(Phase2ResultType.success)
  })

  describe("when an incoming message is an AHO", () => {
    it("returns the output message, audit log events, triggers, correlation ID and the result type", () => {
      const result = phase2Handler(inputAho, auditLogger)

      expect(result).toHaveProperty("auditLogEvents")
      expect(result).toHaveProperty("correlationId")
      expect(result).toHaveProperty("outputMessage")
      expect(result).toHaveProperty("triggers")
      expect(result).toHaveProperty("resultType")
    })

    it("returns a PncUpdateDataset message with a single DISARR", () => {
      const result = phase2Handler(inputAho, auditLogger)

      expect(result.outputMessage.PncOperations).toHaveLength(1)
      expect(result.outputMessage.PncOperations[0].code).toBe("DISARR")
    })

    it("returns a successful result when no exceptions", () => {
      const result = phase2Handler(inputAho, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.success)
    })

    it("returns an exceptions result type when exceptions are generated", () => {
      const inputAhoWithException = structuredClone(inputAho)
      inputAhoWithException.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber =
        "0800NP0100000000001H"

      const result = phase2Handler(inputAhoWithException, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.exceptions)
    })

    it.each([false, undefined])(
      "returns an ignored result type when recordable on PNC indicator is %s",
      (recordableOnPnc) => {
        const ignorableInputAho = structuredClone(inputAho)
        ignorableInputAho.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = recordableOnPnc

        const result = phase2Handler(ignorableInputAho, auditLogger)

        expect(result.resultType).toBe(Phase2ResultType.ignored)
      }
    )
  })

  describe("when an incoming message is a PncUpdateDataset", () => {
    it("returns the output message, audit log events, triggers, correlation ID and the result type", () => {
      const result = phase2Handler(inputPncUpdateDataset, auditLogger)

      expect(result).toHaveProperty("auditLogEvents")
      expect(result).toHaveProperty("correlationId")
      expect(result).toHaveProperty("outputMessage")
      expect(result).toHaveProperty("triggers")
      expect(result).toHaveProperty("resultType")
    })

    it("returns a successful result when no exceptions", () => {
      const result = phase2Handler(inputPncUpdateDataset, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.success)
    })

    it("returns an exceptions result type when exceptions are generated", () => {
      const inputPncUpdateDatasetWithException = structuredClone(inputPncUpdateDataset)
      inputPncUpdateDatasetWithException.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber =
        "0800NP0100000000001H"

      const result = phase2Handler(inputPncUpdateDatasetWithException, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.exceptions)
    })

    it.each([false, undefined])(
      "returns an ignored result type when recordable on PNC indicator is %s",
      (recordableOnPnc) => {
        const ignorableInputPncUpdateDataset = structuredClone(inputPncUpdateDataset)
        ignorableInputPncUpdateDataset.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator =
          recordableOnPnc

        const result = phase2Handler(ignorableInputPncUpdateDataset, auditLogger)

        expect(result.resultType).toBe(Phase2ResultType.ignored)
      }
    )
  })
})
