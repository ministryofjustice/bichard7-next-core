import { type User } from "@moj-bichard7/common/types/User"
import type { FastifyReply, FastifyRequest } from "fastify"
import { UNAUTHORIZED } from "http-status"
import jwtParser from "./jwtParser"
import jwtVerify from "./jwtVerify"

const validApiKey = process.env.API_KEY ?? "password"

export default async function (request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["authorization"]

  if (request.headers["x-api-key"] !== validApiKey || !token?.startsWith("Bearer ")) {
    reply.code(UNAUTHORIZED).send()
    return
  }

  try {
    const jwt = await jwtParser(token.replace("Bearer ", ""))
    const verificationResult: false | User = await jwtVerify(jwt)

    if (!verificationResult) {
      reply.code(UNAUTHORIZED).send()
      return
    }

    request.user = verificationResult
  } catch (err) {
    // this would prevent a 500 response
    // if anything in the try block throws
    request.log.debug(err)
    reply.code(UNAUTHORIZED).send()
  }
}
