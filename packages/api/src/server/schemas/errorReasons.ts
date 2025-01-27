import { CONFLICT, FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "http-status"
import z from "zod"

export const unauthorizedError = {
  [UNAUTHORIZED]: z.null().openapi({ description: "You have entered the wrong security headers" })
}

export const forbiddenError = { [FORBIDDEN]: z.null().openapi({ description: "Invalid" }) }

export const internalServerError = { [INTERNAL_SERVER_ERROR]: z.null().openapi({ description: "Something broke" }) }

const errorSchema = z.object({
  code: z.string(),
  message: z.string(),
  statusCode: z.number()
})

export const conflictError = { [CONFLICT]: errorSchema.openapi({ description: "Conflict when creating resource" }) }
