import z from "zod"

export const CaseIndexQuerystringSchema = z.object({
  maxPerPage: z.coerce.number().min(25).max(200).default(50),
  pageNum: z.coerce.number().min(1).default(1)
})

export type CaseIndexQuerystring = z.infer<typeof CaseIndexQuerystringSchema>
