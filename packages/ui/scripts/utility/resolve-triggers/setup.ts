// eslint-disable-next-line import/no-extraneous-dependencies
import { SSM, RDS } from "aws-sdk"
import { isError } from "../../../src/types/Result"

export default async function setup() {
  const ssm = new SSM({
    region: "eu-west-2"
  })
  const password = await ssm
    .getParameter({
      Name: `/cjse-${process.env.WORKSPACE}-bichard-7/rds/db/password`,
      WithDecryption: true
    })
    .promise()
    .catch((error: Error) => error)
  if (isError(password)) {
    throw password
  }

  const rds = new RDS({
    region: "eu-west-2"
  })

  const clusters = await rds
    .describeDBClusters({
      Filters: [{ Name: "db-cluster-id", Values: [`cjse-${process.env.WORKSPACE}-bichard-7-aurora-cluster`] }]
    })
    .promise()

  process.env.DB_HOST = clusters.DBClusters?.[0].Endpoint
  process.env.DB_USER = "bichard"
  process.env.DB_PASSWORD = password.Parameter?.Value
  process.env.DB_DATABASE = "bichard"
  process.env.DB_SSL = "true"

  if (!process.env.DB_HOST || !process.env.DB_PASSWORD) {
    throw Error("Could not retrieve database host and password")
  }
}
