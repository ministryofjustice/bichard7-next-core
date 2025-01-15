import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"
import { PartialUserRowSchema, UserPartialDtoSchema } from "./User"

export const NoteRowSchema = z.object({
  create_ts: dateLikeToDate,
  error_id: z.number(),
  note_id: z.number(),
  note_text: z.string(),
  user: PartialUserRowSchema.optional(),
  user_id: z.string()
})

export const NoteDtoSchema = z.object({
  createdAt: dateLikeToDate,
  noteText: z.string(),
  user: UserPartialDtoSchema.optional(),
  userFullName: z.string().optional(),
  userId: z.string().optional()
})

export type NoteDto = z.infer<typeof NoteDtoSchema>
export type NoteRow = z.infer<typeof NoteRowSchema>
