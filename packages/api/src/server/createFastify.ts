import type { FastifyInstance } from "fastify"
import type { IncomingMessage, Server, ServerResponse } from "http"

import { randomUUID } from "crypto"
import { fastify as Fastify } from "fastify"

import logger from "./logging/logger"

export default function (): FastifyInstance<Server, IncomingMessage, ServerResponse> {
  const options = {
    disableRequestLogging: true,
    genReqId: () => randomUUID(),
    logger: logger(process.env.NODE_ENV)
  }

  return Fastify(options)
}
