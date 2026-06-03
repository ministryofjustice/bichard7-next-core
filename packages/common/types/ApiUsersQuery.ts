import z from "zod"

export const ApiUsersQuerySchema = z.object({
  name: z.string().optional()
})

export type ApiUsersQuery = z.infer<typeof ApiUsersQuerySchema>
