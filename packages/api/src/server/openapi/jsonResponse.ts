import type z from "zod"

export const jsonResponse = (
  description: string,
  schema: z.ZodArray | z.ZodIntersection | z.ZodObject | z.ZodRecord
) => {
  return {
    content: {
      "application/json": {
        schema
      }
    },
    description
  }
}
