import { Lambda, RDS } from "aws-sdk"
import { isError } from "@moj-bichard7/common/types/Result"
import { DataSource } from "typeorm"
import baseConfig from "@moj-bichard7/common/db/baseConfig"
import { fetchUserDetailsForComms } from "./fetchUserDetailsForComms"
import fs from "fs/promises"

const WORKSPACE = process.env.WORKSPACE ?? "production"
const dbPassword = process.env.DB_PASSWORD
const dbUser = process.env.DB_USER
let postgres: DataSource

async function setup() {
  const lambda = new Lambda({ region: "eu-west-2" })
  const sanitiseMessageLambda = await lambda
    .getFunction({ FunctionName: `bichard-7-${WORKSPACE}-sanitise-message` })
    .promise()
  if (isError(sanitiseMessageLambda)) {
    throw Error("Couldn't get Postgres connection details (failed to get sanitise lambda function)")
  }

  const rds = new RDS({ region: "eu-west-2" })
  const dbInstances = await rds.describeDBClusters().promise()
  if (isError(dbInstances)) {
    throw Error("Couldn't get Postgres connection details (describeDBInstances)")
  }

  const dbHost = dbInstances.DBClusters?.map((clusters) => clusters.ReaderEndpoint).filter((endpoint) =>
    endpoint?.startsWith(`cjse-${WORKSPACE}-bichard-7-aurora-cluster.cluster-ro-`)
  )?.[0]
  process.env.DB_USER = process.env.DB_PASSWORD = process.env.DB_SSL = "true"
  postgres = await new DataSource({
    ...baseConfig,
    host: dbHost || "",
    username: dbUser,
    password: dbPassword,
    type: "postgres",
    applicationName: "ui-connection",
    ssl: { rejectUnauthorized: false }
  }).initialize()
}

const getUsers = async () => {
  await setup()
  const userEmail = await fetchUserDetailsForComms(postgres)
  if (isError(userEmail)) {
    throw userEmail
  }
  await fs.writeFile("/tmp/users.json", JSON.stringify(userEmail, null, 2), "utf-8")
  await postgres.destroy()
}

getUsers()

export default getUsers
