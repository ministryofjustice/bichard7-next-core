import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import fs from "fs"
import MockDate from "mockdate"

import type { AnnotatedHearingOutcome, Offence, Result } from "../types/AnnotatedHearingOutcome"
import type { PncOffence, PncQueryResult } from "../types/PncQueryResult"
import type { PncUpdateDataset } from "../types/PncUpdateDataset"

import CoreAuditLogger from "../lib/CoreAuditLogger"
import parseAhoXml from "../lib/parse/parseAhoXml/parseAhoXml"
import ResultClass from "../types/ResultClass"
import areAllResultsOnPnc from "./lib/areAllResultsOnPnc"
import { parsePncUpdateDataSetXml } from "./parse/parsePncUpdateDataSetXml"
import phase2Handler from "./phase2"
import { Phase2ResultType } from "./types/Phase2Result"

jest.mock("./lib/areAllResultsOnPnc")
const mockedAreAllResultsOnPnc = areAllResultsOnPnc as jest.Mock

describe("Bichard Core Phase 2 processing logic", () => {
  const inputAhoMessage = fs.readFileSync("phase2/tests/fixtures/AnnotatedHO1.xml").toString()
  const inputAho = parseAhoXml(inputAhoMessage) as AnnotatedHearingOutcome
  const ahoTestCase = { inputMessage: inputAho, messageType: "AHO" }

  const inputPncUpdateDatasetMessage = fs.readFileSync("phase2/tests/fixtures/PncUpdateDataSet1.xml").toString()
  const inputPncUpdateDataset = parsePncUpdateDataSetXml(inputPncUpdateDatasetMessage) as PncUpdateDataset
  const pncUpdateDataSetTestCase = { inputMessage: inputPncUpdateDataset, messageType: "PncUpdateDataset" }

  let auditLogger: CoreAuditLogger
  const mockedDate = new Date()
  MockDate.set(mockedDate)

  beforeEach(() => {
    auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
  })

  it("returns an ignored result when an AINT case for AHO", () => {
    const aintCaseInputMessage = structuredClone(inputAho)
    aintCaseInputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {
        CriminalProsecutionReference: {
          OffenceReason: { __type: "NationalOffenceReason" }
        },
        Result: [
          {
            PNCDisposalType: 1000,
            ResultQualifierVariable: [],
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          } as unknown as Result
        ]
      }
    ] as Offence[]

    const result = phase2Handler(aintCaseInputMessage, auditLogger)

    expect(result.resultType).toBe(Phase2ResultType.ignored)
  })

  it("doesn't return an ignored result when an AINT case for PncUpdateDataset", () => {
    const aintCaseInputMessage = structuredClone(inputPncUpdateDataset)
    aintCaseInputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
      {
        CriminalProsecutionReference: {
          OffenceReason: { __type: "NationalOffenceReason" }
        },
        Result: [
          {
            PNCDisposalType: 1000,
            ResultQualifierVariable: [],
            ResultVariableText: "Dummy text. Hearing on 2024-01-01\n confirmed. Dummy text."
          } as unknown as Result
        ]
      }
    ] as Offence[]

    const result = phase2Handler(aintCaseInputMessage, auditLogger)

    expect(result.resultType).not.toBe(Phase2ResultType.ignored)
  })

  it.each([
    { ...ahoTestCase, recordableOnPnc: false },
    { ...ahoTestCase, recordableOnPnc: undefined },
    { ...pncUpdateDataSetTestCase, recordableOnPnc: false },
    { ...pncUpdateDataSetTestCase, recordableOnPnc: undefined }
  ])(
    "returns an ignored result type when recordable on PNC indicator is $recordableOnPnc for $messageType",
    ({ inputMessage, recordableOnPnc }) => {
      const ignorableInputMessage = structuredClone(inputMessage)
      ignorableInputMessage.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = recordableOnPnc

      const result = phase2Handler(ignorableInputMessage, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.ignored)
    }
  )

  it.each([ahoTestCase, pncUpdateDataSetTestCase])(
    "returns the output message, audit log events, triggers, correlation ID and the result type for $messageType",
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
    "returns a successful result when no exceptions for $messageType",
    ({ inputMessage }) => {
      const result = phase2Handler(inputMessage, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.success)
    }
  )

  it.each([ahoTestCase, pncUpdateDataSetTestCase])(
    "returns an exceptions result type when an all offences containing results exception is generated for $messageType",
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
    "returns an exceptions result type when exceptions are generated from getting operations for $messageType",
    ({ inputMessage }) => {
      const inputMessageWithException = structuredClone(inputMessage)
      inputMessageWithException.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber =
        "0800NP0100000000001H"

      const result = phase2Handler(inputMessageWithException, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.exceptions)
    }
  )

  it.each([
    { ...ahoTestCase, resultDescription: "an ignored", resultType: Phase2ResultType.ignored },
    { ...pncUpdateDataSetTestCase, resultDescription: "a successful", resultType: Phase2ResultType.success }
  ])(
    "returns $resultDescription result when no operations and only a HO200200 exception is generated from getting operations for $messageType",
    ({ inputMessage, resultType }) => {
      const inputMessageWithException = structuredClone(inputMessage)
      inputMessageWithException.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing = new Date("05/22/2024")
      inputMessageWithException.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
        {
          ActualOffenceStartDate: { StartDate: new Date() },
          CriminalProsecutionReference: {
            OffenceReason: { __type: "NationalOffenceReason" },
            OffenceReasonSequence: "001"
          },
          Result: [
            {
              AmountSpecifiedInResult: [{ Amount: 25, DecimalPlaces: 2 }],
              CJSresultCode: 3106,
              DateSpecifiedInResult: [{ Date: new Date("05/22/2024"), Sequence: 1 }],
              Duration: [{ DurationLength: 3, DurationType: "", DurationUnit: "Y" }],
              PNCDisposalType: 2063,
              ResultQualifierVariable: [{ Code: "A" }],
              ResultVariableText: `NOT ENTER ${"A".repeat(100)} THIS EXCLUSION REQUIREMENT LASTS FOR TIME`
            }
          ]
        }
      ] as Offence[]

      inputMessageWithException.PncQuery = {
        courtCases: [
          {
            courtCaseReference:
              inputMessageWithException.AnnotatedHearingOutcome.HearingOutcome.Case.CourtCaseReferenceNumber,
            offences: [
              {
                adjudication: {
                  offenceTICNumber: 0,
                  plea: "",
                  sentenceDate: new Date("05/22/2024"),
                  verdict: "NON-CONVICTION"
                },
                disposals: [
                  {
                    qtyDate: "22052024",
                    qtyDuration: "Y3",
                    qtyMonetaryValue: "25",
                    qtyUnitsFined: "Y3  220520240000000.0000",
                    qualifiers: "A",
                    text: "EXCLUDED FROM LOCATION",
                    type: 2063
                  }
                ],
                offence: {
                  cjsOffenceCode: "offence-code",
                  sequenceNumber: 1,
                  startDate: new Date("05/22/2024")
                }
              } as PncOffence
            ]
          }
        ],
        forceStationCode: "06",
        pncId: "123"
      } as PncQueryResult

      const result = phase2Handler(inputMessageWithException, auditLogger)

      expect(result.resultType).toBe(resultType)
    }
  )

  it.each([ahoTestCase, pncUpdateDataSetTestCase])(
    "adds ignored event when all results on the PNC for $messageType",
    ({ inputMessage }) => {
      mockedAreAllResultsOnPnc.mockReturnValue(true)

      const { auditLogEvents } = phase2Handler(inputMessage, auditLogger)

      expect(auditLogEvents).toContainEqual(expect.objectContaining({ eventCode: EventCode.IgnoredAlreadyOnPNC }))
    }
  )

  it.each([ahoTestCase, pncUpdateDataSetTestCase])(
    "doesn't add ignored event when all results are not on the PNC for $messageType",
    ({ inputMessage }) => {
      mockedAreAllResultsOnPnc.mockReturnValue(false)

      const { auditLogEvents } = phase2Handler(inputMessage, auditLogger)

      expect(auditLogEvents).not.toContainEqual(expect.objectContaining({ eventCode: EventCode.IgnoredAlreadyOnPNC }))
    }
  )

  it.each([ahoTestCase, pncUpdateDataSetTestCase])(
    "returns a successful result when there are operations and no exceptions for $messageType",
    ({ inputMessage }) => {
      const result = phase2Handler(inputMessage, auditLogger)

      expect(result.resultType).toBe(Phase2ResultType.success)
      expect(result.outputMessage.PncOperations.length).toBeGreaterThan(0)
    }
  )

  it.each([
    { ...ahoTestCase, resultDescription: "an ignored", resultType: Phase2ResultType.ignored },
    { ...pncUpdateDataSetTestCase, resultDescription: "a successful", resultType: Phase2ResultType.success }
  ])(
    "returns $resultDescription result when there are no operations and no exceptions for $messageType",
    ({ inputMessage, resultType }) => {
      const inputMessageWithNoOperations = structuredClone(inputMessage)
      inputMessageWithNoOperations.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence = [
        {
          CriminalProsecutionReference: {
            OffenceReason: { __type: "NationalOffenceReason" }
          },
          Result: [
            {
              PNCDisposalType: 1001,
              ResultClass: ResultClass.UNRESULTED,
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
