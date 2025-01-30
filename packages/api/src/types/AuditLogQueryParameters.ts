import z from "zod"

export const AuditLogQueryParametersSchema = z.object({
  end: z.coerce.date().optional(),
  eventsFilter: z.string().optional(),
  excludeColumns: z
    .string()
    .transform((value) => value.split(","))
    .pipe(z.string().array())
    .optional(),
  externalCorrelationId: z.string().optional(),
  includeColumns: z
    .string()
    .transform((value) => value.split(","))
    .pipe(z.string().array())
    .optional(),
  lastMessageId: z.string().optional(),
  limit: z.coerce.number().optional(),
  messageHash: z.string().optional(),
  messageId: z.string().optional(),
  start: z.coerce.date().optional(),
  status: z.string().optional(),
  unsanitised: z.coerce.boolean().optional()
})

export type AuditLogQueryParameters = z.infer<typeof AuditLogQueryParametersSchema>
