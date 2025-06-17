import type { TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb"

type DynamoUpdate = NonNullable<TransactWriteCommandInput["TransactItems"]>[number]

export default DynamoUpdate
