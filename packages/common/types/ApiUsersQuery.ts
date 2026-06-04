import z from "zod"

export const ApiUsersQuerySchema = z.object({
  usernameOrName: z.string().optional()
})

export type ApiUsersQuery = z.infer<typeof ApiUsersQuerySchema>
