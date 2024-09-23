import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import type { JWT } from "@moj-bichard7/common/types/JWT"
import { type User } from "@moj-bichard7/common/types/User"
import postgres from "postgres"
import fetchUserByUsername from "../services/fetchUserByUsername"

const dbConfig = createDbConfig()
const db = postgres(dbConfig)

export default async (jwt?: JWT): Promise<false | User> => {
  if (!jwt) {
    return false
  }

  const [now, expires] = [new Date(), new Date(jwt["exp"] * 1000)]
  if (expires < now) {
    return false
  }

  const user = await fetchUserByUsername(db, jwt["username"])
  if (user.jwt_id !== jwt["id"]) {
    return false
  }

  return user
}
