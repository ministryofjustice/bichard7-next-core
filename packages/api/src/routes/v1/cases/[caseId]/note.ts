import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { NoteSchema } from "@moj-bichard7/common/types/Note"
import { isError } from "@moj-bichard7/common/types/Result"
import { CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status"
import z from "zod"

import type DatabaseGateway from "../../../../types/DatabaseGateway"

import auth from "../../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError
} from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { NotFoundError } from "../../../../types/errors/NotFoundError"
import createNote from "../../../../useCases/cases/createNote"

type HandlerProps = {
  caseId: number
  database: DatabaseGateway
  noteText: string
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  body: NoteSchema.pick({ noteText: true }),
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [CREATED]: z.null().meta({ description: "Note successfully created" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ caseId, database, noteText, reply, user }: HandlerProps) => {
  const createNoteResult = await createNote(database.writable, user, caseId, noteText)

  if (isError(createNoteResult)) {
    reply.log.error(createNoteResult)

    if (createNoteResult instanceof NotFoundError) {
      return reply.code(NOT_FOUND).send()
    }

    return reply.code(INTERNAL_SERVER_ERROR).send()
  }

  return reply.code(CREATED).send()
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.Note, { schema }, async (req, reply) => {
    await handler({
      caseId: Number(req.params.caseId),
      database: req.database,
      noteText: req.body.noteText,
      reply,
      user: req.user
    })
  })
}

export default route
