import type { AWSError } from "aws-sdk"
import { Lambda } from "aws-sdk"
import type { PromiseResult } from "aws-sdk/lib/request"

export default class InvokeCompareBatchLambda {
  constructor(private comparisonLambdaName: string, private comparisonBucketName: string) {}

  call(s3Paths: string[], batchSize = 1000): Promise<PromiseResult<Lambda.InvocationResponse, AWSError>[]> {
    const batches = s3Paths.reduce(
      (acc: string[][], s3Path) => {
        if (acc[acc.length - 1].length >= batchSize) {
          acc.push([])
        }

        acc[acc.length - 1].push(s3Path)
        return acc
      },
      [[]]
    )

    const invocationResultPromises = batches.map((batch) => {
      const payload = batch.map((s3Path) => ({
        detail: {
          bucket: { name: this.comparisonBucketName },
          object: { key: s3Path }
        }
      }))

      const params: Lambda.InvocationRequest = {
        FunctionName: this.comparisonLambdaName,
        InvocationType: "Event",
        LogType: "Tail",
        Payload: JSON.stringify(payload)
      }

      const lambda = new Lambda()
      return lambda.invoke(params).promise()
    })

    return Promise.all(invocationResultPromises)
  }
}
