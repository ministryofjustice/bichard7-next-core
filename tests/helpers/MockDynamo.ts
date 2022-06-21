import * as dynamodb from "@aws-sdk/client-dynamodb"
const dynalite = require("dynalite") as any

export default class MockDynamo {
  server: any // eslint-disable-line @typescript-eslint/no-explicit-any

  start(port: number): Promise<void> {
    this.server = dynalite({ createTableMs: 0, deleteTableMs: 0, updateTableMs: 0 })
    return new Promise<void>((resolve) => this.server.listen(port, () => resolve()))
  }

  async setupTable(tableConfig: dynamodb.CreateTableCommandInput): Promise<void> {
    const db = new dynamodb.DynamoDB({
      endpoint: `http://localhost:${this.server.address().port}`,
      region: "test",
      credentials: { accessKeyId: "test", secretAccessKey: "test" }
    })
    await db.deleteTable({ TableName: tableConfig.TableName }).catch((error) => error)
    await db.createTable(tableConfig).catch((error) => error)
  }

  stop(): Promise<void> {
    return new Promise<void>((resolve) => this.server.close(() => resolve()))
  }
}
