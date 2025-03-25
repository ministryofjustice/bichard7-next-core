import type { FastifyInstance } from "fastify"
import type { IncomingMessage, Server, ServerResponse } from "http"

import { fastify as Fastify } from "fastify"

import logger from "./logger"

export default function (): FastifyInstance<Server, IncomingMessage, ServerResponse> {
  const options = { logger: logger(process.env.NODE_ENV) }

  return Fastify(options)
}
