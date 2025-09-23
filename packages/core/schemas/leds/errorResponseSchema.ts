import z from "zod"

export const errorSchema = z.object({
  description: z.string().optional(),
  errorDetailType: z.string(),
  message: z.string()
})

const errorTypeSchema = z.enum([
  "conflict/version",
  "conflict/duplicate-exists",
  "conflict/pending-change-exists",
  "conflict/missing-required-data",
  "unprocessable/references-exist",
  "unprocessable/no-changes",
  "unprocessable/maximum-limit-reached",
  "unprocessable/not-allowed",
  "bad-request/does-not-match",
  "bad-request/invalid-reference",
  "forbidden/payload"
])

const errorResponseSchema = z.object({
  status: z.number(),
  title: z.string(),
  type: errorTypeSchema,
  details: z.string(),
  instance: z.string(),
  leds: z.object({
    errors: z.array(errorSchema)
  })
})

export default errorResponseSchema
