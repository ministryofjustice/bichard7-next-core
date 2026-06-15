import z from "zod"

export const ApiUserLookupQuerySchema = z.object({
  usernameOrName: z.string().optional()
})

export type ApiUserLookupQuery = z.infer<typeof ApiUserLookupQuerySchema>
