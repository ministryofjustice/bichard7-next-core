import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply, FastifyRequest } from "fastify"

import { isError } from "@moj-bichard7/common/types/Result"
import { BAD_GATEWAY, UNAUTHORIZED } from "http-status"

import type { DatabaseConnection } from "../../types/DatabaseGateway"

import handleDisconnectedError from "../../services/db/handleDisconnectedError"
import verifyJwt from "./verifyJwt"

export default async function (
  database: DatabaseConnection,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<undefined | User> {
  const token = request.headers["authorization"]

  if (!token?.startsWith("Bearer ")) {
    reply.code(UNAUTHORIZED).send()
    return undefined
  }

  const jwtString = token.replace("Bearer ", "")
  const verificationResult = await verifyJwt(database, jwtString).catch((error: Error) => error)

  if (isError(verificationResult)) {
    request.log.error(verificationResult)

    const replyCode = handleDisconnectedError(verificationResult) ? BAD_GATEWAY : UNAUTHORIZED
    reply.code(replyCode).send()
    return undefined
  }

  return verificationResult
}
