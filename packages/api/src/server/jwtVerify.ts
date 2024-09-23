import type { FastifyReply } from "fastify"
import { FORBIDDEN } from "http-status"
import type { JWT } from "./jwtParser"

export default async (jwt: JWT, res: FastifyReply) => {
  // TODO: Verify the token, expiration and return user groups
  if (jwt["username"] === "Bichard01") {
    return jwt
  }

  res.code(FORBIDDEN).send()
}
