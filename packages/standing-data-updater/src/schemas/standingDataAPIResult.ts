import { z } from "zod"

export const apiOffenceSchema = z.object({
  code: z.string(),
  OffenceType: z.string().optional(),
  CjsTitle: z.string().optional()
})

export const getOffenceApiResultSchema = z.object({
  MessageBody: z.object({
    GatewayOperationType: z.object({
      GetOffenceResponse: z.object({
        Offence: z.array(apiOffenceSchema)
      })
    })
  })
})
