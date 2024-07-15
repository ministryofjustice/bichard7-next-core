jest.mock("./lib/isAintCase")
jest.mock("./lib/allPncOffencesContainResults")
jest.mock("./lib/getOperationSequence")
jest.mock("./lib/refreshOperationSequence")
jest.mock("../phase1/triggers/generate")
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import MockDate from "mockdate"
import CoreAuditLogger from "../lib/CoreAuditLogger"
import generateFakeAho from "../phase1/tests/helpers/generateFakeAho"
import generateTriggers from "../phase1/triggers/generate"
import allPncOffencesContainResults from "./lib/allPncOffencesContainResults"
import { getOperationSequence } from "./lib/getOperationSequence"
import isAintCase from "./lib/isAintCase"
import refreshOperationSequence from "./lib/refreshOperationSequence"
import phase2 from "./phase2"
import generateFakePncUpdateDataset from "./tests/fixtures/helpers/generateFakePncUpdateDataset"

const mockedIsAintCase = isAintCase as jest.Mock
const mockedAllPncOffencesContainResults = allPncOffencesContainResults as jest.Mock
const mockedRefreshOperationSequence = refreshOperationSequence as jest.Mock
const mockedGetOperationSequence = getOperationSequence as jest.Mock
const mockedGenerateTriggers = generateTriggers as jest.Mock

mockedAllPncOffencesContainResults.mockReset()
mockedRefreshOperationSequence.mockReset()
mockedGetOperationSequence.mockReset()
mockedGenerateTriggers.mockReset()

describe("phase2", () => {
  const date = new Date()

  beforeAll(() => {
    MockDate.set(date)
  })

  afterAll(() => {
    MockDate.reset()
  })

  describe("message is AHO", () => {
    it("should generate hearing-outcome.ignored.ancillary event when isAintCase is true", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakeAho({})
      mockedIsAintCase.mockReturnValue(true)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.received-phase-2",
          attributes: {},
          timestamp: date,
          eventType: "Hearing outcome received by phase 2",
          eventSource: "CorePhase2",
          category: "information"
        },
        {
          eventCode: "hearing-outcome.ignored.ancillary",
          attributes: {},
          timestamp: date,
          eventType: "Interim hearing with ancillary only court results. PNC not updated",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toStrictEqual([{ code: TriggerCode.TRPR0001 }])
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should generate hearing-outcome.ignored.nonrecordable event when isAintCase is false, and case is not recordable", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakeAho({})
      mockedIsAintCase.mockReturnValue(false)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      message.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = false

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.received-phase-2",
          attributes: {},
          timestamp: date,
          eventType: "Hearing outcome received by phase 2",
          eventSource: "CorePhase2",
          category: "information"
        },
        {
          eventCode: "hearing-outcome.ignored.nonrecordable",
          attributes: {},
          timestamp: date,
          eventType: "Hearing Outcome ignored as no offences are recordable",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should not generate triggers and additional audit log events when isAintCase is false, case is recordable, and allPncOffencesContainResults is false", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakeAho({})
      mockedIsAintCase.mockReturnValue(false)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      message.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
      mockedAllPncOffencesContainResults.mockReturnValue(false)

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.received-phase-2",
          attributes: {},
          timestamp: date,
          eventType: "Hearing outcome received by phase 2",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should not generate triggers and additional audit log events when isAintCase is false, case is recordable, allPncOffencesContainResults is false, and getOperationSequence generate exceptions", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakeAho({})
      mockedIsAintCase.mockReturnValue(false)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      message.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
      mockedAllPncOffencesContainResults.mockReturnValue(true)
      mockedGetOperationSequence.mockImplementation((output) => {
        output.HasError = true
        return []
      })

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.received-phase-2",
          attributes: {},
          timestamp: date,
          eventType: "Hearing outcome received by phase 2",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should generate triggers and hearing-outcome.ignored.nonrecordable event when isAintCase is false, case is recordable, allPncOffencesContainResults is false, and getOperationSequence returns no operations", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakeAho({})
      mockedIsAintCase.mockReturnValue(false)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      message.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
      mockedAllPncOffencesContainResults.mockReturnValue(true)
      mockedGetOperationSequence.mockImplementation((output) => {
        output.HasError = false
        return []
      })

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.received-phase-2",
          attributes: {},
          timestamp: date,
          eventType: "Hearing outcome received by phase 2",
          eventSource: "CorePhase2",
          category: "information"
        },
        {
          eventCode: "hearing-outcome.ignored.nonrecordable",
          attributes: {},
          timestamp: date,
          eventType: "Hearing Outcome ignored as no offences are recordable",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toEqual([{ code: TriggerCode.TRPR0001 }])
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should not generate triggers and additional audit log events when isAintCase is false, case is recordable, allPncOffencesContainResults is false, and getOperationSequence returns some operations", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakeAho({})
      mockedIsAintCase.mockReturnValue(false)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      message.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = true
      mockedAllPncOffencesContainResults.mockReturnValue(true)
      mockedGetOperationSequence.mockImplementation((output) => {
        output.HasError = false
        return [{ code: "NEWREM" }]
      })

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.received-phase-2",
          attributes: {},
          timestamp: date,
          eventType: "Hearing outcome received by phase 2",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toEqual([{ code: "NEWREM" }])
    })
  })

  describe("message is PNC Update Dataset", () => {
    it("should not generate hearing-outcome.ignored.ancillary event when isAintCase is true", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakePncUpdateDataset({})
      mockedIsAintCase.mockReturnValue(true)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      mockedAllPncOffencesContainResults.mockReturnValue(false)

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.resubmitted-received",
          attributes: {},
          timestamp: date,
          eventType: "Resubmitted hearing outcome received",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should not generate hearing-outcome.ignored.nonrecordable event when isAintCase is false and case is not recordable", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakePncUpdateDataset({})
      mockedIsAintCase.mockReturnValue(false)
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      message.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator = false
      mockedAllPncOffencesContainResults.mockReturnValue(false)

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.resubmitted-received",
          attributes: {},
          timestamp: date,
          eventType: "Resubmitted hearing outcome received",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should not generate triggers and additional events when allPncOffencesContainResults is false", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakePncUpdateDataset({})
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      mockedAllPncOffencesContainResults.mockReturnValue(false)

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.resubmitted-received",
          attributes: {},
          timestamp: date,
          eventType: "Resubmitted hearing outcome received",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should refresh PNC operations and generate hearing-outcome.submitted-phase-3 event when allPncOffencesContainResults is true and PNC operations is not empty", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakePncUpdateDataset({ PncOperations: [{ code: "COMSEN", status: "NotAttempted" }] })
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      mockedAllPncOffencesContainResults.mockReturnValue(true)
      mockedRefreshOperationSequence.mockImplementation((output) => {
        output.PncOperations.push({ code: "NEWREM" })
      })

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.resubmitted-received",
          attributes: {},
          timestamp: date,
          eventType: "Resubmitted hearing outcome received",
          eventSource: "CorePhase2",
          category: "information"
        },
        {
          eventCode: "hearing-outcome.submitted-phase-3",
          attributes: {},
          timestamp: date,
          eventType: "Hearing outcome submitted to phase 3",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toEqual([
        { code: "COMSEN", status: "NotAttempted" },
        { code: "NEWREM" }
      ])
    })

    it("should not generate triggers and additional events when allPncOffencesContainResults is true, PNC operations is empty, and getOperations generate exceptions", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakePncUpdateDataset({ PncOperations: [] })
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      mockedAllPncOffencesContainResults.mockReturnValue(true)
      mockedGetOperationSequence.mockImplementation((output) => {
        output.HasError = true
        return []
      })

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.resubmitted-received",
          attributes: {},
          timestamp: date,
          eventType: "Resubmitted hearing outcome received",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should generate triggers without additional events when allPncOffencesContainResults is true, PNC operations is empty, and getOperations returns no operations", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakePncUpdateDataset({ PncOperations: [] })
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      mockedAllPncOffencesContainResults.mockReturnValue(true)
      mockedGetOperationSequence.mockImplementation((output) => {
        output.HasError = false
        return []
      })

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.resubmitted-received",
          attributes: {},
          timestamp: date,
          eventType: "Resubmitted hearing outcome received",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toEqual([{ code: TriggerCode.TRPR0001 }])
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toHaveLength(0)
    })

    it("should not generate triggers and additional events when allPncOffencesContainResults is true, PNC operations is empty, and getOperations returns some operations", () => {
      const auditLogger = new CoreAuditLogger(AuditLogEventSource.CorePhase2)
      const message = generateFakePncUpdateDataset({ PncOperations: [] })
      mockedGenerateTriggers.mockReturnValue([{ code: TriggerCode.TRPR0001 }])
      mockedAllPncOffencesContainResults.mockReturnValue(true)
      mockedGetOperationSequence.mockImplementation((output) => {
        output.HasError = false
        return [{ code: "NEWREM" }, { code: "DISARR" }]
      })

      const result = phase2(message, auditLogger)

      expect(result.auditLogEvents).toStrictEqual([
        {
          eventCode: "hearing-outcome.resubmitted-received",
          attributes: {},
          timestamp: date,
          eventType: "Resubmitted hearing outcome received",
          eventSource: "CorePhase2",
          category: "information"
        }
      ])
      expect(result.correlationId).toStrictEqual(
        message.AnnotatedHearingOutcome.HearingOutcome.Hearing.SourceReference.UniqueID
      )
      expect(result.triggers).toHaveLength(0)
      expect(result.outputMessage.HasError).toBe(false)
      expect(result.outputMessage.PncOperations).toEqual([{ code: "NEWREM" }, { code: "DISARR" }])
    })
  })
})
