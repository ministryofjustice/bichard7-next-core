import * as dynamodb from "@aws-sdk/client-dynamodb"
import { isError } from "@moj-bichard7/common/types/Result"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynalite = require("dynalite") as any

export default class MockDynamo {
  server: any // eslint-disable-line @typescript-eslint/no-explicit-any

  async setupTable(tableConfig: dynamodb.CreateTableCommandInput): Promise<void> {
    const db = new dynamodb.DynamoDB({
      endpoint: `http://localhost:${this.server.address().port}`,
      region: "test",
      credentials: { accessKeyId: "test", secretAccessKey: "test" }
    })
    await db.deleteTable({ TableName: tableConfig.TableName }).catch((error) => error)
    const createTableResult = await db.createTable(tableConfig).catch((error) => error)
    if (isError(createTableResult)) {
      console.log(createTableResult)
    }
  }

  start(port: number): Promise<void> {
    this.server = dynalite({ createTableMs: 0, deleteTableMs: 0, updateTableMs: 0 })
    return new Promise<void>((resolve) => this.server.listen(port, () => resolve()))
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve) => this.server.close(() => resolve()))
  }
}
