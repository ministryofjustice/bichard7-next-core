import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply, FastifyRequest } from "fastify"
import { BAD_GATEWAY, UNAUTHORIZED } from "http-status"
import handleDisconnectedError from "../../services/db/handleDisconnectedError"
import type Gateway from "../../services/gateways/interfaces/gateway"
import jwtParser from "./jwtParser"
import jwtVerify from "./jwtVerify"

export default async function (gateway: Gateway, request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["authorization"]

  if (!token?.startsWith("Bearer ")) {
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
  } catch (error) {
    request.log.error(error)

    if (handleDisconnectedError(error)) {
      reply.code(BAD_GATEWAY).send()
      return
    }

    reply.code(UNAUTHORIZED).send()
  }
}
