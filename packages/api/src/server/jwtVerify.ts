import type { FastifyReply } from "fastify"
import { FORBIDDEN } from "http-status"
import type { JWT } from "./jwtParser"

export default async (jwt: JWT, res: FastifyReply) => {
  if (jwt["username"] === "Bichard01") {
    return jwt
  }

  res.code(FORBIDDEN).send()
}
