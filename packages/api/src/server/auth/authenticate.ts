import jwtParser from "@/server/auth/jwtParser"
import jwtVerify from "@/server/auth/jwtVerify"
import type Gateway from "@/services/gateways/interfaces/gateway"
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply, FastifyRequest } from "fastify"
import { UNAUTHORIZED } from "http-status"

const validApiKey = process.env.WORKSPACE === "production" ? process.env.API_KEY : "password"

export default async function (gateway: Gateway, request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["authorization"]

  if (request.headers["x-api-key"] !== validApiKey || !token?.startsWith("Bearer ")) {
    reply.code(UNAUTHORIZED).send()
    return
  }

  try {
    const jwt = await jwtParser(token.replace("Bearer ", ""))

    if (!jwt) {
      reply.code(UNAUTHORIZED).send()
      return
    }

    const verificationResult: User | undefined = await jwtVerify(gateway, jwt)

    if (!verificationResult) {
      reply.code(UNAUTHORIZED).send()
      return
    }

    request.user = verificationResult
    request.gateway = gateway
  } catch (err) {
    request.log.error(err)
    reply.code(UNAUTHORIZED).send()
  }
}
