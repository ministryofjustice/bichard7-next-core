jest.setTimeout(30_000)
import "../../phase1/tests/helpers/setEnvironmentVariables"

import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import "jest-xml-matcher"
import postgres from "postgres"

import * as putFileToS3Module from "@moj-bichard7/common/s3/putFileToS3"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import insertErrorListRecord from "../../lib/database/insertErrorListRecord"
import insertErrorListTriggers from "../../lib/database/insertErrorListTriggers"
import errorPaths from "../../lib/exceptions/errorPaths"
import generateMockPhase1Result from "../../phase1/tests/helpers/generateMockPhase1Result"
import generateMockPhase2Result from "../../phase2/tests/helpers/generateMockPhase2Result"
import { Phase2ResultType } from "../../phase2/types/Phase2Result"
import ResolutionStatus from "../../types/ResolutionStatus"
import persistPhase2 from "./persistPhase2"
const putFileToS3 = putFileToS3Module.default
const mockPutFileToS3 = putFileToS3Module as { default: any }

const bucket = "conductor-task-data"
const s3Config = createS3Config()
const dbConfig = createDbConfig()
const sql = postgres({
  ...dbConfig,
  types: {
    date: {
      to: 25,
      from: [1082],
      serialize: (x: string): string => x,
      parse: (x: string): Date => {
        return new Date(x)
      }
    }
  }
})

describe("persistPhase2", () => {
  beforeAll(() => {
    process.env.TASK_DATA_BUCKET_NAME = bucket
  })

  beforeEach(async () => {
    await sql`DELETE FROM br7own.error_list`
    mockPutFileToS3.default = putFileToS3
  })

  describe("When record exists in the database", () => {
    it("should write exceptions and triggers to the database if they are raised", async () => {
      const phase1Result = generateMockPhase1Result({
        triggers: [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0002 }, { code: TriggerCode.TRPR0003 }]
      })
      const recordId = await insertErrorListRecord(sql, phase1Result)
      await insertErrorListTriggers(sql, recordId, phase1Result.triggers)

      const phase2Result = generateMockPhase2Result({ correlationId: phase1Result.correlationId })
      phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
      const s3TaskDataPath = "phase2-exception.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(1)
      expect(errorListRecords[0].error_status).toBe(ResolutionStatus.UNRESOLVED)
      expect(errorListRecords[0].trigger_status).toBe(ResolutionStatus.UNRESOLVED)
      expect(errorListRecords[0].error_report).toBe("HO100100||br7:ArrestSummonsNumber")
      expect(errorListRecords[0].error_reason).toBe("HO100100")

      const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
      expect(triggerRecords).toHaveLength(3)
    })

    it("should update record if case is ignored", async () => {
      const phase1Result = generateMockPhase1Result({ triggers: [] })
      const recordId = await insertErrorListRecord(sql, phase1Result)
      await sql`UPDATE br7own.error_list SET error_status = ${ResolutionStatus.SUBMITTED}::integer WHERE error_id = ${recordId}`

      const phase2Result = generateMockPhase2Result({
        correlationId: phase1Result.correlationId,
        resultType: Phase2ResultType.ignored
      })
      const s3TaskDataPath = "phase2-ignored.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(1)
      expect(errorListRecords[0].error_status).toBe(ResolutionStatus.RESOLVED)
      expect(errorListRecords[0].trigger_status).toBeNull()
      expect(errorListRecords[0].error_report).toBe("")
      expect(errorListRecords[0].error_reason).toBeNull()

      const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
      expect(triggerRecords).toHaveLength(0)
    })

    it("should not update existing triggers in the database if trigger generator is not called", async () => {
      const phase1Result = generateMockPhase1Result({
        triggers: [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0002 }, { code: TriggerCode.TRPR0003 }]
      })
      const recordId = await insertErrorListRecord(sql, phase1Result)
      await insertErrorListTriggers(sql, recordId, phase1Result.triggers)

      const phase2Result = generateMockPhase2Result({
        correlationId: phase1Result.correlationId,
        triggerGenerationAttempted: false
      })
      phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
      const s3TaskDataPath = "phase2-no-trigger-update.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(1)
      expect(errorListRecords[0].error_status).toBe(ResolutionStatus.UNRESOLVED)
      expect(errorListRecords[0].trigger_status).toBe(ResolutionStatus.UNRESOLVED)

      const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
      expect(triggerRecords).toEqual([
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.UNRESOLVED,
          trigger_code: "TRPR0001",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        },
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.UNRESOLVED,
          trigger_code: "TRPR0002",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        },
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.UNRESOLVED,
          trigger_code: "TRPR0003",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        }
      ])
    })

    it("should delete existing incomplete triggers in the database if trigger generator is called but no triggers are generated", async () => {
      const phase1Result = generateMockPhase1Result({
        triggers: [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0002 }, { code: TriggerCode.TRPR0003 }]
      })
      const recordId = await insertErrorListRecord(sql, phase1Result)
      await insertErrorListTriggers(sql, recordId, phase1Result.triggers)
      // Mark TRPR0001 as completed
      await sql`UPDATE br7own.error_list_triggers SET status = ${ResolutionStatus.RESOLVED}::integer
              WHERE trigger_id IN (SELECT trigger_id FROM br7own.error_list_triggers WHERE trigger_code = ${TriggerCode.TRPR0001})`

      const phase2Result = generateMockPhase2Result({
        correlationId: phase1Result.correlationId,
        triggerGenerationAttempted: true,
        triggers: []
      })
      phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
      const s3TaskDataPath = "phase2-delete-triggers.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(1)
      expect(errorListRecords[0].error_status).toBe(ResolutionStatus.UNRESOLVED)
      expect(errorListRecords[0].trigger_status).toBe(ResolutionStatus.UNRESOLVED)

      const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
      expect(triggerRecords).toEqual([
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.RESOLVED,
          trigger_code: "TRPR0001",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        }
      ])
    })

    it("should add new triggers and not update completed triggers in the database if trigger generator is called and triggers are generated", async () => {
      const phase1Result = generateMockPhase1Result({
        triggers: [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0002 }, { code: TriggerCode.TRPR0003 }]
      })
      const recordId = await insertErrorListRecord(sql, phase1Result)
      await insertErrorListTriggers(sql, recordId, phase1Result.triggers)
      // Mark TRPR0001 as completed
      await sql`UPDATE br7own.error_list_triggers SET status = ${ResolutionStatus.RESOLVED}::integer, resolved_by = 'dummy_user'
            WHERE trigger_id IN 
                  (SELECT trigger_id FROM br7own.error_list_triggers WHERE trigger_code = ${TriggerCode.TRPR0001})`

      const phase2Result = generateMockPhase2Result({
        correlationId: phase1Result.correlationId,
        triggerGenerationAttempted: true,
        triggers: [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0003 }, { code: TriggerCode.TRPS0002 }]
      })
      phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
      const s3TaskDataPath = "phase2-new-triggers.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(1)
      expect(errorListRecords[0].trigger_status).toBe(ResolutionStatus.UNRESOLVED)

      const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
      expect(triggerRecords).toEqual([
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.UNRESOLVED,
          trigger_code: "TRPR0003",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        },
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: "dummy_user",
          resolved_ts: null,
          status: 2,
          trigger_code: "TRPR0001",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        },
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.UNRESOLVED,
          trigger_code: "TRPS0002",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        }
      ])
    })
  })

  describe("When record does not exist in the database", () => {
    it("should insert the record and triggers when triggers are generated", async () => {
      const phase2Result = generateMockPhase2Result({
        triggers: [{ code: TriggerCode.TRPS0002 }, { code: TriggerCode.TRPS0003 }],
        triggerGenerationAttempted: true
      })
      const s3TaskDataPath = "phase2-insert-triggers.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(1)
      expect(errorListRecords[0].error_status).toBeNull()
      expect(errorListRecords[0].trigger_status).toBe(ResolutionStatus.UNRESOLVED)

      const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
      expect(triggerRecords).toEqual([
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.UNRESOLVED,
          trigger_code: "TRPS0002",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        },
        {
          create_ts: expect.anything(),
          error_id: expect.anything(),
          resolved_by: null,
          resolved_ts: null,
          status: ResolutionStatus.UNRESOLVED,
          trigger_code: "TRPS0003",
          trigger_id: expect.anything(),
          trigger_item_identity: null
        }
      ])
    })

    it("should not insert the record and triggers when Phase 2 has attempted generating triggers but no triggers generated", async () => {
      const phase2Result = generateMockPhase2Result({
        triggers: [],
        triggerGenerationAttempted: true
      })
      const s3TaskDataPath = "phase2-insert-triggers.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(0)
    })

    it("should not insert the record and triggers when Phase 2 has not attempted generating triggers", async () => {
      const phase2Result = generateMockPhase2Result({
        triggers: [],
        triggerGenerationAttempted: false
      })
      const s3TaskDataPath = "phase2-insert-triggers.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
      expect(result.logs?.map((l) => l.log)).toContain(
        "No exceptions present, triggers not generated, and case is not ignored but persist_phase2 was called"
      )

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(0)
    })

    it("should insert the recordwhen exceptions are generated", async () => {
      const phase2Result = generateMockPhase2Result({
        triggers: [],
        triggerGenerationAttempted: false
      })
      phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
      const s3TaskDataPath = "phase2-insert-triggers.xml"
      await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

      const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
      expect(result.status).toBe("COMPLETED")

      const errorListRecords = await sql`SELECT * FROM br7own.error_list`
      expect(errorListRecords).toHaveLength(1)
      expect(errorListRecords[0].error_status).toBe(ResolutionStatus.UNRESOLVED)
      expect(errorListRecords[0].error_report).toBe("HO100100||br7:ArrestSummonsNumber")
      expect(errorListRecords[0].error_reason).toBe("HO100100")
    })
  })

  it("should fail with terminal error if the result cannot be parsed", async () => {
    const phase2Result = generateMockPhase2Result() as unknown as Record<string, unknown>
    delete phase2Result.outputMessage
    const s3TaskDataPath = "phase2-invalid-format.xml"
    await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("S3 data schema parse error: Expected object for outputMessage")
  })

  it("should fail with terminal error if there no exception, triggers are not generated, and case is not ignored", async () => {
    const phase2Result = generateMockPhase2Result({
      triggerGenerationAttempted: false,
      resultType: Phase2ResultType.success
    })
    phase2Result.outputMessage.Exceptions = []
    const s3TaskDataPath = "phase2-no-triggers-exceptions-ignored.xml"
    await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "No exceptions present, triggers not generated, and case is not ignored but persist_phase2 was called"
    )
  })

  it("should fail if it can't fetch the file from S3", async () => {
    const result = await persistPhase2.execute({ inputData: { s3TaskDataPath: "missing.json" } })

    expect(result).toHaveProperty("status", "FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("Could not retrieve file from S3: missing.json")
  })

  it("should fail with terminal error if the S3 path is missing", async () => {
    const result = await persistPhase2.execute({ inputData: {} })

    expect(result).toHaveProperty("status", "FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain(
      "Input data schema parse error: Expected string for s3TaskDataPath"
    )
  })
})
