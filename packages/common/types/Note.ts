import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"
import { UserDtoSchema, UserSchema } from "./User"

export const NoteSchema = z.object({
  create_ts: dateLikeToDate,
  error_id: z.number(),
  note_id: z.number(),
  note_text: z.string(),
  user: UserSchema.pick({ forenames: true, surname: true, username: true, visible_forces: true }).optional(),
  user_id: z.string()
})

const NoteUserDtoSchema = UserDtoSchema.pick({
  forenames: true,
  surname: true,
  username: true,
  visibleForces: true
})

export const NoteDtoSchema = z.object({
  createdAt: dateLikeToDate,
  noteText: z.string(),
  user: NoteUserDtoSchema.optional(),
  userFullName: z.string().optional(),
  userId: z.string().optional()
})

export type Note = z.infer<typeof NoteSchema>
export type NoteDto = z.infer<typeof NoteDtoSchema>
export type NoteUserDto = z.infer<typeof NoteUserDtoSchema>
