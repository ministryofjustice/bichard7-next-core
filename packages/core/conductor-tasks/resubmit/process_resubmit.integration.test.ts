import "../../tests/helpers/setEnvironmentVariables"
import type { NoteRow } from "@moj-bichard7/common/types/Note"

import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import getFileFromS3 from "@moj-bichard7/common/s3/getFileFromS3"
import * as putFileToS3Module from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import { randomUUID } from "crypto"
import postgres from "postgres"

import { setupCase } from "../../tests/helpers/setupCase"
import processResubmit from "./process_resubmit"

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

describe("process_resubmit", () => {
  beforeAll(() => {
    process.env.TASK_DATA_BUCKET_NAME = bucket
  })

  beforeEach(async () => {
    await sql`TRUNCATE br7own.error_list RESTART IDENTITY CASCADE`

    mockPutFileToS3.default = putFileToS3
  })

  afterAll(async () => {
    await sql.end()
  })

  it("will fail if there's no matching message ID", async () => {
    const messageId = randomUUID()
    const s3Data = { errorLockedByUsername: "bob", messageId, events: [], autoResubmit: false }
    const s3TaskDataPath = `${messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("FAILED")
  })

  it("will fail if there is no Updated AHO", async () => {
    const caseDb = await setupCase(sql)
    const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: false }
    const s3TaskDataPath = `${s3Data.messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    await sql`
      UPDATE br7own.error_list
      SET updated_msg = NULL 
      WHERE error_id = ${caseDb.error_id}
    `

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("Error: Missing updated_msg")
  })

  it("will fail if the Updated AHO is not XML", async () => {
    const caseDb = await setupCase(sql)
    const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: false }
    const s3TaskDataPath = `${s3Data.messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    await sql`
      UPDATE br7own.error_list
      SET updated_msg = '{ "not": "xml" }' 
      WHERE error_id = ${caseDb.error_id}
    `

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("Error: Could not parse AHO XML")
  })

  it("will fail if there is a S3 error", async () => {
    const caseDb = await setupCase(sql)
    const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: false }
    const s3TaskDataPath = `${s3Data.messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    mockPutFileToS3.default = () => {
      return Promise.resolve(new Error("Mock error"))
    }

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("Error: Mock error")
  })

  it("completes the task", async () => {
    const caseDb = await setupCase(sql)
    const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: false }
    const s3TaskDataPath = `${s3Data.messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("s3TaskDataPath", `${caseDb.message_id}.json`)
  })

  it("if the transaction fails, it will not create a note", async () => {
    const caseDb = await setupCase(sql)
    const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: false }
    const s3TaskDataPath = `${s3Data.messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    mockPutFileToS3.default = () => {
      return Promise.resolve(new Error("Mock error"))
    }

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("FAILED")

    const notes =
      (await sql`SELECT * FROM br7own.error_list_notes eln WHERE eln.error_id = ${caseDb.error_id}`) as NoteRow[]

    expect(notes).toHaveLength(0)
  })

  it("creates notes", async () => {
    const caseDb = await setupCase(sql)
    const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: false }
    const s3TaskDataPath = `${s3Data.messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })
    const notes =
      (await sql`SELECT * FROM br7own.error_list_notes eln WHERE eln.error_id = ${caseDb.error_id} ORDER BY eln.create_ts DESC`) as NoteRow[]

    expect(result.status).toBe("COMPLETED")
    expect(notes.length).toBeGreaterThan(0)
    expect(notes[0].note_text).toMatch("Resubmitted Message")
  })

  it("uploads the Updated AHO to S3", async () => {
    const caseDb = await setupCase(sql)
    const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: false }
    const s3TaskDataPath = `${s3Data.messageId}.json`
    await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

    const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toHaveProperty("s3TaskDataPath", s3TaskDataPath)

    const updatedFile = await getFileFromS3(s3TaskDataPath, bucket, s3Config)
    if (isError(updatedFile)) {
      throw updatedFile
    }

    const parsedUpdatedFile = JSON.parse(updatedFile, dateReviver)
    expect(parsedUpdatedFile).toHaveProperty("AnnotatedHearingOutcome")
    expect(parsedUpdatedFile).toHaveProperty("Exceptions")
  })

  describe("with auto resubmit", () => {
    it("completes the task", async () => {
      const caseDb = await setupCase(sql)
      const s3Data = { errorLockedByUsername: "bob", messageId: caseDb.message_id, events: [], autoResubmit: true }
      const s3TaskDataPath = `${s3Data.messageId}.json`
      await putFileToS3(JSON.stringify(s3Data), s3TaskDataPath, bucket, s3Config)

      const result = await processResubmit.execute({ inputData: { s3TaskDataPath } })

      expect(result.status).toBe("COMPLETED")
      expect(result.outputData).toHaveProperty("s3TaskDataPath", `${caseDb.message_id}.json`)
    })
  })
})
