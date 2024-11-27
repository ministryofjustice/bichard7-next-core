import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply, FastifyRequest } from "fastify"

import { BAD_GATEWAY, UNAUTHORIZED } from "http-status"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import handleDisconnectedError from "../../services/db/handleDisconnectedError"
import jwtVerify from "./jwtVerify"

export default async function (db: DataStoreGateway, request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["authorization"]

  if (!token?.startsWith("Bearer ")) {
    reply.code(UNAUTHORIZED).send()
    return
  }

  try {
    const jwtString = token.replace("Bearer ", "")
    const verificationResult: undefined | User = await jwtVerify(db, jwtString)

    if (!verificationResult) {
      reply.code(UNAUTHORIZED).send()
      return
    }

    request.user = verificationResult
    request.db = db
  } catch (error) {
    request.log.error(error)

    if (handleDisconnectedError(error)) {
      reply.code(BAD_GATEWAY).send()
      return
    }

    reply.code(UNAUTHORIZED).send()
  }
}
