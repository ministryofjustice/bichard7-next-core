import type z from "zod"

export const jsonResponse = (description: string, schema: z.ZodIntersection | z.ZodObject) => {
  return {
    content: {
      "application/json": {
        schema
      }
    },
    description
  }
}
