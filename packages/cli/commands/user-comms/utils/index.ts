import { RDS } from "aws-sdk"
import { isError } from "@moj-bichard7/common/types/Result"
import { DataSource } from "typeorm"
import baseConfig from "@moj-bichard7/common/db/baseConfig"

type UsersQueryResult = { forenames: string; email: string }[]

async function fetchUserDetailsForComms(postgres: DataSource): Promise<string[][] | Error> {
  const result = await postgres
    .query<UsersQueryResult>(
      `
        SELECT u.forenames, u.email 
        FROM br7own.users AS u
        WHERE u.email ILIKE '%madete%' 
          AND u.deleted_at IS NULL
        ORDER BY u.forenames
      `
    )
    .catch((error) => error as Error)

  if (isError(result)) {
    return result
  }

  return result.map(({ forenames, email }) => [forenames, email])
}

const WORKSPACE = process.env.WORKSPACE ?? "production"
let postgres: DataSource

async function setup() {
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
    username: "bichard",
    password: password,
    type: "postgres",
    applicationName: "ui-connection",
    ssl: { rejectUnauthorized: false }
  }).initialize()
}

const run = async () => {
  await setup()
  const userEmail = await fetchUserDetailsForComms(postgres)
  if (isError(userEmail)) {
    throw userEmail
  }

  console.log(userEmail)
  await postgres.destroy()
}

run()

export default run
