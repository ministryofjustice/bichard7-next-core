import { Lambda } from "aws-sdk"
import { isError } from "../Types"
import type { CompareLambdaEvent } from "../Types/CompareLambdaEvent"

export default class InvokeCompareLambda {
  constructor(private comparisonLambdaName: string, private comparisonBucketName: string) {}

  async call(s3Path: string) {
    const payload: CompareLambdaEvent = {
      detail: {
        bucket: { name: this.comparisonBucketName },
        object: { key: s3Path }
      }
    }

    const params: Lambda.InvocationRequest = {
      FunctionName: this.comparisonLambdaName,
      InvocationType: "Event",
      LogType: "Tail",
      Payload: JSON.stringify(payload)
    }

    const lambda = new Lambda()
    const invocationResult = await lambda
      .invoke(params)
      .promise()
      .catch((error: Error) => error)

    return isError(invocationResult) ? invocationResult : undefined
  }
}
