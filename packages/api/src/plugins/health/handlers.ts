import type { RouteHandlerMethod } from "fastify"
import { OK } from "http-status"

const healthHandler: RouteHandlerMethod = async (_, res) => {
  res.code(OK).send("Ok")
}

export { healthHandler }
