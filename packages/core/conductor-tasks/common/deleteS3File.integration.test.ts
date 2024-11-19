import "../../phase1/tests/helpers/setEnvironmentVariables"

const bucketName = (process.env.TASK_DATA_BUCKET_NAME = "conductor-task-data")

import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { randomUUID } from "crypto"
import deleteS3File from "./deleteS3File"

import * as deleteFileFromS3Module from "@moj-bichard7/common/s3/deleteFileFromS3"
const deleteFileFromS3 = deleteFileFromS3Module.default
const deleteFileFromS3Error = () => new Error("S3 Error")
const mockDeleteFileFromS3 = deleteFileFromS3Module as { default: any }

const s3Config = createS3Config()

describe("deleteS3File", () => {
  beforeAll(() => {
    mockDeleteFileFromS3.default = deleteFileFromS3
  })

  it("should delete the file from S3", async () => {
    const fileName = `${randomUUID()}.xml`
    await putFileToS3("Hello World", fileName, bucketName, s3Config)

    const result = await deleteS3File.execute({
      inputData: { bucketId: "task-data", fileName }
    })

    expect(result.status).toBe("COMPLETED")
    expect(result.logs?.map((l) => l.log)).toContain(`S3 file marked for deletion: ${fileName}`)
  })

  it("should fail with terminal error if the bucket ID was invalid", async () => {
    const result = await deleteS3File.execute({
      inputData: { bucketId: "invalid-bucket-id", fileName: `${randomUUID()}.xml` }
    })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("Bucket ID was not found: invalid-bucket-id")
  })

  it("should fail with terminal error if the file path is missing", async () => {
    const result = await deleteS3File.execute({
      inputData: { bucketId: "task-data" }
    })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected string for fileName")
  })

  it("should fail with terminal error if the bucket ID is missing", async () => {
    const result = await deleteS3File.execute({
      inputData: { fileName: "foo.xml" }
    })

    expect(result.status).toBe("FAILED_WITH_TERMINAL_ERROR")
    expect(result.logs?.map((l) => l.log)).toContain("InputData error: Expected string for bucketId")
  })

  it("should fail if there is an s3 error", async () => {
    mockDeleteFileFromS3.default = deleteFileFromS3Error
    const result = await deleteS3File.execute({
      inputData: { bucketId: "task-data", fileName: `${randomUUID()}.xml` }
    })

    expect(result.status).toBe("FAILED")
    expect(result.logs?.map((l) => l.log)).toContain("S3 Error")
  })
})
