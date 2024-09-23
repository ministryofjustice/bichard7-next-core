import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { FastifyReply, FastifyRequest } from "fastify"
import { UNAUTHORIZED } from "http-status"
import postgres from "postgres"
import fetchUserByUsername from "../services/fetchUserByUsername"

const dbConfig = createDbConfig()
const db = postgres(dbConfig)

export default async (jwt: JWT, req: FastifyRequest, res: FastifyReply) => {
  const [now, expires] = [new Date(), new Date(jwt["exp"] * 1000)]
  console.log(now, "\n", expires)
  if (expires < now) {
    res.code(UNAUTHORIZED).send()
    return
  }

  const user = await fetchUserByUsername(db, jwt["username"])
  if (user.jwt_id !== jwt["id"]) {
    res.code(UNAUTHORIZED).send()
  }

  req.user = user
}
