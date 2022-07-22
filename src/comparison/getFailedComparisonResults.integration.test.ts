import MockDynamo from "tests/helpers/MockDynamo"
import createDynamoDbConfig from "./createDynamoDbConfig"
import DynamoGateway from "./DynamoGateway/DynamoGateway"
import dynamoDbTableConfig from "tests/helpers/testDynamoDbTableConfig"

const dynamoDbGatewayConfig = createDynamoDbConfig()

describe("getFailedComparisonResults", () => {
  let dynamoServer: MockDynamo
  const dynamoGateway = new DynamoGateway(dynamoDbGatewayConfig)

  beforeAll(async () => {
    dynamoServer = new MockDynamo()
    await dynamoServer.start(8000)
  })

  afterAll(async () => {
    await dynamoServer.stop()
  })

  beforeEach(async () => {
    await dynamoServer.setupTable(dynamoDbTableConfig)
  })
})
