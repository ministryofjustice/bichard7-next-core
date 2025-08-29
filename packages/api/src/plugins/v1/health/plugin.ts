import type { FastifyInstance } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { OK } from "http-status"
import { z } from "zod"

import useZod from "../../../server/useZod"
import { healthHandler } from "./handlers"

const schema = {
  description: "Health endpoint",
  response: { [OK]: z.string().meta({ description: "Health check will return Ok" }) },
  security: [],
  tags: ["Health V1"]
} satisfies FastifyZodOpenApiSchema

const plugin = async (fastify: FastifyInstance) => {
  useZod(fastify).get(V1.Health, { logLevel: "silent", schema }, healthHandler)
}

export default plugin
