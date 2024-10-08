import logger from "@/server/logger"
import type { FastifyInstance } from "fastify"
import { fastify as Fastify } from "fastify"
import fs from "fs"
import type { IncomingMessage, Server, ServerResponse } from "http"

export default function (): FastifyInstance<Server, IncomingMessage, ServerResponse> {
  let fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>

  const options = { logger: logger(process.env.NODE_ENV) }

  if (process.env.USE_SSL === "true") {
    fastify = Fastify({
      ...options,
      https: { key: fs.readFileSync("/certs/server.key"), cert: fs.readFileSync("/certs/server.crt") }
    })
  } else {
    fastify = Fastify(options)
  }

  return fastify
}
