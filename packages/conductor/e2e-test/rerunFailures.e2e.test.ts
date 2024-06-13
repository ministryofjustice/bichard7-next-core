jest.setTimeout(30_000)
jest.retryTimes(10)

import {
  getDynamoRecord,
  getPhaseTableName,
  sendFileToS3,
  setDynamoRecordToFailedStatus,
  startWorkflow
} from "./helpers/e2eHelpers"
import waitForExpect from "wait-for-expect"
import { s3Client, dbClient } from "./helpers/clients"
import { randomUUID } from "crypto"

describe("Rerun failures workflow", () => {
  it("should rerun failed phase 2 comparisons and update dynamo record", async () => {
    const phase = 2
    const fixturePath = `../core/phase${phase}/tests/fixtures/e2e-comparison/test-001.json`
    const tableName = getPhaseTableName(phase)
    //write file to s3 with unique id
    const firstMessageS3Path = `${new Date().toISOString().replace(/:/g, "_")}.json`
    await sendFileToS3(s3Client, fixturePath, firstMessageS3Path, "comparisons")
    const secondMessageDate = new Date()
    secondMessageDate.setDate(secondMessageDate.getDate() - 1)
    const secondMessageS3Path = `${secondMessageDate.toISOString().replace(/:/g, "_")}.json`
    await sendFileToS3(s3Client, fixturePath, secondMessageS3Path, "comparisons")

    //wait for dynamo to be updated
    let firstRecord: Record<string, any> | undefined, secondRecord: Record<string, any> | undefined
    await waitForExpect(async () => {
      firstRecord = await getDynamoRecord(dbClient, firstMessageS3Path, tableName)
      expect(firstRecord?.["history"]).toHaveLength(1)
      expect(firstRecord).toBeDefined()
      expect(firstRecord).toHaveProperty("s3Path", firstMessageS3Path)

      secondRecord = await getDynamoRecord(dbClient, secondMessageS3Path, tableName)
      expect(secondRecord?.["history"]).toHaveLength(1)
      expect(secondRecord).toBeDefined()
      expect(secondRecord).toHaveProperty("s3Path", secondMessageS3Path)
    })

    await setDynamoRecordToFailedStatus(dbClient, firstRecord!, tableName)

    const startDate = new Date()
    startDate.setHours(startDate.getHours() - 1)

    await startWorkflow("rerun_failures", { startDate: startDate.toISOString() }, randomUUID())

    await waitForExpect(
      async () => {
        const updatedFirstRecord = await getDynamoRecord(dbClient, firstMessageS3Path, tableName)
        expect(updatedFirstRecord).toBeDefined()
        expect(updatedFirstRecord?.["history"]).toHaveLength(2)
        expect(firstRecord?.["latestRunAt"]).not.toBe(updatedFirstRecord?.latestRunAt)

        const updatedSecondRecord = await getDynamoRecord(dbClient, secondMessageS3Path, tableName)
        expect(updatedSecondRecord).toBeDefined()
        expect(updatedSecondRecord?.["history"]).toHaveLength(1)
        expect(secondRecord?.["latestRunAt"]).toBe(updatedSecondRecord?.latestRunAt)
      },
      60_000,
      5_000
    )
  })
})
