import { CONFLICT, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status"
import z from "zod"

const errorResponse = (error: number, description: string) => {
  return {
    [error]: {
      content: {
        "application/json": {
          schema: z.object({
            code: z.string(),
            message: z.string(),
            statusCode: z.number()
          })
        }
      },
      description
    }
  }
}

export const unauthorizedError = () => {
  return {
    [UNAUTHORIZED]: { description: "You have entered the wrong security headers" }
  }
}

export const forbiddenError = () => {
  return {
    [FORBIDDEN]: { description: "Invalid" }
  }
}

export const notFoundError = () => {
  return {
    [NOT_FOUND]: { description: "Not Found" }
  }
}

export const conflictError = () => errorResponse(CONFLICT, "Conflict when creating resource")

export const unprocessableEntityError = () => errorResponse(UNPROCESSABLE_ENTITY, "Error when processing the request")

export const internalServerError = () => {
  return {
    [INTERNAL_SERVER_ERROR]: { description: "Something broke" }
  }
}
