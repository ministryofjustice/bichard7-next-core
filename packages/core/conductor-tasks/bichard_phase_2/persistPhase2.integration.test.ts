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
import generateMockPhase2Result from "../../phase1/tests/helpers/generateMockPhase2Result"
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

  it("should write exceptions to the database if they are raised", async () => {
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
    const s3TaskDataPath = "phase2-exception.xml"
    await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)
    expect(errorListRecords[0].error_status).toBe(ResolutionStatus.RESOLVED)

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
      triggersGenerated: false
    })
    phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
    const s3TaskDataPath = "phase2-exception.xml"
    await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toEqual([
      {
        create_ts: expect.anything(),
        error_id: expect.anything(),
        resolved_by: null,
        resolved_ts: null,
        status: 1,
        trigger_code: "TRPR0001",
        trigger_id: expect.anything(),
        trigger_item_identity: null
      },
      {
        create_ts: expect.anything(),
        error_id: expect.anything(),
        resolved_by: null,
        resolved_ts: null,
        status: 1,
        trigger_code: "TRPR0002",
        trigger_id: expect.anything(),
        trigger_item_identity: null
      },
      {
        create_ts: expect.anything(),
        error_id: expect.anything(),
        resolved_by: null,
        resolved_ts: null,
        status: 1,
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
      triggersGenerated: true,
      triggers: []
    })
    phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
    const s3TaskDataPath = "phase2-exception.xml"
    await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toEqual([
      {
        create_ts: expect.anything(),
        error_id: expect.anything(),
        resolved_by: null,
        resolved_ts: null,
        status: 2,
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
      triggersGenerated: true,
      triggers: [{ code: TriggerCode.TRPR0001 }, { code: TriggerCode.TRPR0003 }, { code: TriggerCode.TRPS0002 }]
    })
    phase2Result.outputMessage.Exceptions.push({ code: ExceptionCode.HO100100, path: errorPaths.case.asn })
    const s3TaskDataPath = "phase2-exception.xml"
    await putFileToS3(JSON.stringify(phase2Result), s3TaskDataPath, bucket, s3Config)

    const result = await persistPhase2.execute({ inputData: { s3TaskDataPath } })
    expect(result.status).toBe("COMPLETED")

    const errorListRecords = await sql`SELECT * FROM br7own.error_list`
    expect(errorListRecords).toHaveLength(1)

    const triggerRecords = await sql`SELECT * FROM br7own.error_list_triggers`
    expect(triggerRecords).toEqual([
      {
        create_ts: expect.anything(),
        error_id: expect.anything(),
        resolved_by: null,
        resolved_ts: null,
        status: 1,
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
        status: 1,
        trigger_code: "TRPS0002",
        trigger_id: expect.anything(),
        trigger_item_identity: null
      }
    ])
  })
})
