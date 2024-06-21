import "../../phase1/tests/helpers/setEnvironmentVariables"

const bucketName = (process.env.TASK_DATA_BUCKET_NAME = "conductor-task-data")

import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import * as readS3FileTagsModule from "@moj-bichard7/common/s3/readS3FileTags"
import * as writeS3FileTagsModule from "@moj-bichard7/common/s3/writeS3FileTags"
import { randomUUID } from "crypto"
import lockS3File from "./lockS3File"

const readS3FileTags = readS3FileTagsModule.default
const readS3FileTagsError = () => new Error("S3 Read Tags Error")
const mockReadS3FileTags = readS3FileTagsModule as { default: any }

const writeS3FileTags = writeS3FileTagsModule.default
const writeS3FileTagsError = () => new Error("S3 Write Tags Error")
const mockWriteS3FileTags = writeS3FileTagsModule as { default: any }

const s3Config = createS3Config()

describe("lockS3File", () => {
  beforeEach(() => {
    mockReadS3FileTags.default = readS3FileTags
    mockWriteS3FileTags.default = writeS3FileTags
  })

  it("should fail with terminal error if the bucket ID was invalid", async () => {
    const result = await lockS3File.execute({
      inputData: { bucketId: "invalid-bucket-id", fileName: `${randomUUID()}.xml`, lockId: randomUUID() }
    })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("Bucket ID was not found: invalid-bucket-id")
  })

  it("should add a lock on to the file as tags and return COMPLETE as success", async () => {
    const fileName = `${randomUUID()}.xml`
    const lockId = randomUUID()
    await putFileToS3("Hello World", fileName, bucketName, s3Config)

    const tags = await readS3FileTags(fileName, bucketName, s3Config)
    expect(tags).toStrictEqual({})

    const result = await lockS3File.execute({
      inputData: { bucketId: "task-data", fileName, lockId }
    })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toStrictEqual({ lockState: "success" })
    expect(result.logs?.map((l) => l.log)).toContain("File successfully locked")

    const updatedTags = await readS3FileTags(fileName, bucketName, s3Config)
    expect(updatedTags).toStrictEqual({ lockedByWorkstream: lockId })
  })

  it("should return COMPLETE with failure when the file is missing", async () => {
    const fileName = `${randomUUID()}.xml`
    const lockId = randomUUID()
    const result = await lockS3File.execute({
      inputData: { bucketId: "task-data", fileName, lockId }
    })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toStrictEqual({ lockState: "failure" })
    expect(result.logs?.map((l) => l.log)).toContain("S3 File already deleted")
  })

  it("should return COMPLETE when the file is already locked", async () => {
    const fileName = `${randomUUID()}.xml`
    const lockId = randomUUID()
    await putFileToS3("Hello World", fileName, bucketName, s3Config, { lockedByWorkstream: lockId })

    const tags = await readS3FileTags(fileName, bucketName, s3Config)
    expect(tags).toStrictEqual({ lockedByWorkstream: lockId })

    const result = await lockS3File.execute({
      inputData: { bucketId: "task-data", fileName, lockId }
    })

    expect(result.status).toBe("COMPLETED")
    expect(result.outputData).toStrictEqual({ lockState: "failure" })
    expect(result.logs?.map((l) => l.log)).toContain("S3 File already locked")
  })

  it("should return FAILURE when there is an error reading the tags", async () => {
    mockReadS3FileTags.default = readS3FileTagsError

    const fileName = `${randomUUID()}.xml`
    const lockId = randomUUID()
    const result = await lockS3File.execute({
      inputData: { bucketId: "task-data", fileName, lockId }
    })

    expect(result.status).toBe("FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("S3 Read Tags Error")
  })

  it("should return FAILURE when there is an error writing the tags", async () => {
    mockWriteS3FileTags.default = writeS3FileTagsError

    const fileName = `${randomUUID()}.xml`
    const lockId = randomUUID()
    await putFileToS3("Hello World", fileName, bucketName, s3Config)

    const tags = await readS3FileTags(fileName, bucketName, s3Config)
    expect(tags).toStrictEqual({})

    const result = await lockS3File.execute({
      inputData: { bucketId: "task-data", fileName, lockId }
    })

    expect(result.status).toBe("FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("S3 Write Tags Error")
  })
})
