import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyReply, FastifyRequest } from "fastify"

import { BAD_GATEWAY, UNAUTHORIZED } from "http-status"

import type DataStoreGateway from "../../services/gateways/interfaces/dataStoreGateway"

import handleDisconnectedError from "../../services/db/handleDisconnectedError"
import formatForceNumbers from "../../services/formatForceNumbers"
import jwtVerify from "./jwtVerify"

export default async function (dataStore: DataStoreGateway, request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers["authorization"]

  if (!token?.startsWith("Bearer ")) {
    reply.code(UNAUTHORIZED).send()
    return
  }

  try {
    const jwtString = token.replace("Bearer ", "")
    const verificationResult: undefined | User = await jwtVerify(dataStore, jwtString)

    if (!verificationResult) {
      reply.code(UNAUTHORIZED).send()
      return
    }

    request.user = verificationResult
    dataStore.forceIds = formatForceNumbers(request.user.visible_forces)
    dataStore.visibleCourts = request.user.visible_courts?.split(",") ?? []
    request.dataStore = dataStore
  } catch (error) {
    request.log.error(error)

    if (handleDisconnectedError(error)) {
      reply.code(BAD_GATEWAY).send()
      return
    }

    reply.code(UNAUTHORIZED).send()
  }
}
