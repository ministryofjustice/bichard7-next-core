import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyBaseLogger, FastifyInstance, FastifyReply } from "fastify"
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { NoteSchema } from "@moj-bichard7/common/types/Note"
import { isError } from "@moj-bichard7/common/types/Result"
import { FORBIDDEN, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import type DatabaseGateway from "../../../../types/DatabaseGateway"

import auth from "../../../../server/schemas/auth"
import {
  forbiddenError,
  internalServerError,
  notFoundError,
  unauthorizedError,
  unprocessableEntityError
} from "../../../../server/schemas/errorReasons"
import useZod from "../../../../server/useZod"
import { NotFoundError } from "../../../../types/errors/NotFoundError"
import { UnprocessableEntityError } from "../../../../types/errors/UnprocessableEntityError"
import createNote from "../../../../useCases/cases/createNote"

type HandlerProps = {
  auditLogGateway: AuditLogDynamoGateway
  caseId: number
  database: DatabaseGateway
  logger: FastifyBaseLogger
  noteText: string
  reply: FastifyReply
  user: User
}

const schema = {
  ...auth,
  body: NoteSchema.pick({ noteText: true }),
  params: z.object({ caseId: z.string().meta({ description: "Case ID" }) }),
  response: {
    [OK]: z.null().meta({ description: "Note successfully created" }),
    ...unauthorizedError(),
    ...forbiddenError(),
    ...notFoundError(),
    ...unprocessableEntityError(),
    ...internalServerError()
  },
  tags: ["Cases V1"]
} satisfies FastifyZodOpenApiSchema

const handler = async ({ caseId, database, logger, noteText, reply, user }: HandlerProps) => {
  const createNoteResult = await createNote(database.writable, user, caseId, logger, noteText)

  if (!isError(createNoteResult)) {
    return reply.code(OK).send()
  }

  reply.log.error(createNoteResult)

  switch (true) {
    case createNoteResult instanceof NotFoundError:
      return reply.code(NOT_FOUND).send()
    case createNoteResult instanceof UnprocessableEntityError:
      return reply
        .code(UNPROCESSABLE_ENTITY)
        .send({ code: `${UNPROCESSABLE_ENTITY}`, message: createNoteResult.message, statusCode: UNPROCESSABLE_ENTITY })
    default:
      return reply.code(FORBIDDEN).send()
  }
}

const route = async (fastify: FastifyInstance) => {
  useZod(fastify).post(V1.Note, { schema }, async (req, reply) => {
    await handler({
      auditLogGateway: req.auditLogGateway,
      caseId: Number(req.params.caseId),
      database: req.database,
      logger: req.log,
      noteText: req.body.noteText,
      reply,
      user: req.user
    })
  })
}

export default route
