import type { RouteHandlerMethod } from "fastify"
import { OK } from "http-status"

const handler: RouteHandlerMethod = async (_, res) => {
  res.code(OK).send("Ok")
}

export default handler
