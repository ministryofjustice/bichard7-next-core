import z from "zod"

export enum Order {
  asc = "asc",
  desc = "desc"
}

export enum OrderBy {
  courtDate = "courtDate",
  courtName = "courtName"
}

export const CaseIndexQuerystringSchema = z.object({
  maxPerPage: z.coerce.number().min(25).max(200).default(50),
  order: z.enum(Object.keys(Order) as [keyof typeof Order]).optional(),
  orderBy: z.enum(Object.keys(OrderBy) as [keyof typeof OrderBy]).optional(),
  pageNum: z.coerce.number().min(1).default(1)
})

export type CaseIndexQuerystring = z.infer<typeof CaseIndexQuerystringSchema>

export type Pagination = Pick<CaseIndexQuerystring, "maxPerPage" | "pageNum">
export type SortOrder = Pick<CaseIndexQuerystring, "order" | "orderBy">
