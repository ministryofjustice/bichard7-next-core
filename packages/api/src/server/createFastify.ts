import type { FastifyInstance } from "fastify"
import type { IncomingMessage, Server, ServerResponse } from "http"

import { fastify as Fastify } from "fastify"
import fs from "fs"

import logger from "./logger"

export default function (): FastifyInstance<Server, IncomingMessage, ServerResponse> {
  let fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>

  const options = { logger: logger(process.env.NODE_ENV) }

  if (process.env.USE_SSL === "true") {
    fastify = Fastify({
      ...options,
      https: { cert: fs.readFileSync("/certs/server.crt"), key: fs.readFileSync("/certs/server.key") }
    })
  } else {
    fastify = Fastify(options)
  }

  return fastify
}
