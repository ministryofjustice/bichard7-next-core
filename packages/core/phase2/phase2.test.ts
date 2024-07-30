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
import ResultClass from "../types/ResultClass"

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

  describe("when an incoming message is an AHO or a PncUpdateDataset", () => {
    const ahoTestCase = { inputMessage: inputAho, type: "AHO" }
    const pncUpdateDataSetTestCase = { inputMessage: inputPncUpdateDataset, type: "PncUpdateDataset" }

    it.each([ahoTestCase, pncUpdateDataSetTestCase])(
      "returns successful result when an AINT case for $type",
      ({ inputMessage }) => {
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
      }
    )

    it.each([
      { ...ahoTestCase, recordableOnPnc: false },
      { ...ahoTestCase, recordableOnPnc: undefined },
      { ...pncUpdateDataSetTestCase, recordableOnPnc: false },
      { ...pncUpdateDataSetTestCase, recordableOnPnc: undefined }
    ])(
      "returns an ignored result type when recordable on PNC indicator is $recordableOnPnc for $type",
      ({ inputMessage, recordableOnPnc }) => {
        const ignorableInputMessage = structuredClone(inputMessage)
        ignorableInputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = recordableOnPnc

        const result = phase2Handler(ignorableInputMessage, auditLogger)

        expect(result.resultType).toBe(Phase2ResultType.ignored)
      }
    )

    it.each([ahoTestCase, pncUpdateDataSetTestCase])(
      "returns the output message, audit log events, triggers, correlation ID and the result type for $type",
      ({ inputMessage }) => {
        const result = phase2Handler(inputMessage, auditLogger)

        expect(result).toHaveProperty("auditLogEvents")
        expect(result).toHaveProperty("correlationId")
        expect(result).toHaveProperty("outputMessage")
        expect(result).toHaveProperty("triggers")
        expect(result).toHaveProperty("resultType")
      }
    )

    it.each([ahoTestCase, pncUpdateDataSetTestCase])(
      "returns a successful result when no exceptions for $type",
      ({ inputMessage }) => {
        const result = phase2Handler(inputMessage, auditLogger)

        expect(result.resultType).toBe(Phase2ResultType.success)
      }
    )

    it.each([ahoTestCase, pncUpdateDataSetTestCase])(
      "returns an exceptions result type when an all offences containing results exception is generated for $type",
      ({ inputMessage }) => {
        const inputMessageWithException = structuredClone(inputMessage)
        inputMessageWithException.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
          { Result: [] as Result[] }
        ] as Offence[]

        const result = phase2Handler(inputMessageWithException, auditLogger)

        expect(result.resultType).toBe(Phase2ResultType.exceptions)
      }
    )

    it.each([ahoTestCase, pncUpdateDataSetTestCase])(
      "returns an exceptions result type when exceptions are generated from getting operations for $type",
      ({ inputMessage }) => {
        const inputMessageWithException = structuredClone(inputMessage)
        inputMessageWithException.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber =
          "0800NP0100000000001H"

        const result = phase2Handler(inputMessageWithException, auditLogger)

        expect(result.resultType).toBe(Phase2ResultType.exceptions)
      }
    )

    it.each([ahoTestCase, pncUpdateDataSetTestCase])(
      "returns a successful result when there are operations and no exceptions for $type",
      ({ inputMessage }) => {
        const result = phase2Handler(inputMessage, auditLogger)

        expect(result.resultType).toBe(Phase2ResultType.success)
        expect(result.outputMessage.PncOperations.length).toBeGreaterThan(0)
      }
    )

    it.each([
      { ...ahoTestCase, resultType: Phase2ResultType.ignored, resultDescription: "an ignored" },
      { ...pncUpdateDataSetTestCase, resultType: Phase2ResultType.success, resultDescription: "a successful" }
    ])(
      "returns $resultDescription result when there are no operations and no exceptions for $type",
      ({ inputMessage, resultType }) => {
        const inputMessageWithNoOperations = structuredClone(inputMessage)
        inputMessageWithNoOperations.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
          {
            CriminalProsecutionReference: {
              OffenceReason: { __type: "NationalOffenceReason" }
            },
            Result: [
              {
                ResultClass: ResultClass.UNRESULTED,
                PNCDisposalType: 1001,
                ResultQualifierVariable: []
              } as unknown as Result
            ]
          }
        ] as Offence[]

        const result = phase2Handler(inputMessageWithNoOperations, auditLogger)

        expect(result.resultType).toBe(resultType)
      }
    )
  })
})
