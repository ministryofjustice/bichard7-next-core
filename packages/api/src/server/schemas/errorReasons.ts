import { CONFLICT, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

export const unauthorizedError = {
  [UNAUTHORIZED]: z.null().meta({ description: "You have entered the wrong security headers" })
}

export const forbiddenError = { [FORBIDDEN]: z.null().meta({ description: "Invalid" }) }

export const internalServerError = { [INTERNAL_SERVER_ERROR]: z.null().meta({ description: "Something broke" }) }

const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
  statusCode: z.number()
})

export const conflictError = { [CONFLICT]: errorSchema.meta({ description: "Conflict when creating resource" }) }

export const unprocessableEntityError = {
  [UNPROCESSABLE_ENTITY]: errorSchema.meta({ description: "Error when processing the request" })
}

export const notFoundError = { [NOT_FOUND]: z.null().meta({ description: "Not Found" }) }
