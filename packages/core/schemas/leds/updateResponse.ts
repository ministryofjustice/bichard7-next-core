import z from "zod"

export const successfulUpdateResponseSchema = z.object({
  id: z.string()
})

export const updateResponseSchema = z.object({
  id: z.string()
})
