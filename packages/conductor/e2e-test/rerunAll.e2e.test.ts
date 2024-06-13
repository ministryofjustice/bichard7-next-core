jest.setTimeout(30_000)
jest.retryTimes(10)

import waitForExpect from "wait-for-expect"
import { getPhaseTableName, sendFileToS3, getDynamoRecord } from "./helpers/e2eHelpers"
import { dbClient, s3Client } from "./helpers/clients"
import createConductorClient from "@moj-bichard7/common/conductor/createConductorClient"
import { randomUUID } from "crypto"

const conductorClient = createConductorClient()

describe("Rerun all workflow", () => {
  it("should rerun phase 2 comparisons and update dynamo record", async () => {
    const phase = 2
    const fixturePath = `../core/phase${phase}/tests/fixtures/e2e-comparison/test-001.json`
    const tableName = getPhaseTableName(phase)
    //write file to s3 with unique id
    const s3Path = `${new Date().toISOString().replace(/:/g, "_")}.json`
    await sendFileToS3(s3Client, fixturePath, s3Path, "comparisons")

    //wait for dynamo to be updated
    let originalRecord: Record<string, any> | undefined
    await waitForExpect(async () => {
      originalRecord = await getDynamoRecord(dbClient, s3Path, tableName)
      expect(originalRecord?.["history"]).toHaveLength(1)
      expect(originalRecord).toBeDefined()
    })

    expect(originalRecord).toHaveProperty("s3Path", s3Path)

    const startDate = new Date()
    startDate.setHours(startDate.getHours() - 1)

    await conductorClient.workflowResource.startWorkflow1(
      "rerun_all",
      { startDate: startDate.toISOString() },
      undefined,
      randomUUID()
    )

    await waitForExpect(
      async () => {
        const updatedRecord = await getDynamoRecord(dbClient, s3Path, tableName)
        expect(updatedRecord).toBeDefined()
        expect(updatedRecord?.["history"]).toHaveLength(2)
        expect(originalRecord?.["latestRunAt"]).not.toBe(updatedRecord?.latestRunAt)
      },
      60_000,
      5_000
    )
  })
})
