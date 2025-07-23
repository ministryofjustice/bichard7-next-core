import { isError } from "@moj-bichard7/common/types/Result"
import { DataSource } from "typeorm"
import baseConfig from "@moj-bichard7/common/db/baseConfig"
import { currentUsersQuery } from "./currentUsersQuery"
import fs from "fs/promises"

const dbPassword = process.env.DB_PASSWORD
const dbUser = process.env.DB_USER
const dbHost = process.env.DB_HOST
let postgres: DataSource

async function setup() {
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

const getUsersDetails = async () => {
  await setup()
  const userEmail = await currentUsersQuery(postgres)
  if (isError(userEmail)) {
    throw userEmail
  }

  await fs.writeFile("/tmp/users.json", JSON.stringify(userEmail, null, 2), "utf-8")
  await postgres.destroy()
}

getUsersDetails()

export default getUsersDetails
