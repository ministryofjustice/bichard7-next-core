import { z } from "zod"

import { dateLikeToDate } from "../schemas/dateLikeToDate"
import { UserDtoSchema, UserRowSchema, UserSchema } from "./User"

export const NoteUserRowSchema = UserRowSchema.pick({
  forenames: true,
  surname: true,
  username: true,
  visible_forces: true
})

export const NoteUserSchema = UserSchema.pick({ forenames: true, surname: true, username: true, visibleForces: true })

export const NoteRowSchema = z.object({
  create_ts: dateLikeToDate,
  error_id: z.number(),
  note_id: z.number(),
  note_text: z.string(),
  user: NoteUserRowSchema.optional(),
  user_id: z.string()
})

export const NoteSchema = z.object({
  createdAt: dateLikeToDate,
  errorId: z.number(),
  noteId: z.number(),
  noteText: z.string(),
  user: NoteUserSchema.optional(),
  userId: z.string()
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
export type NoteRow = z.infer<typeof NoteRowSchema>
export type NoteUser = z.infer<typeof NoteUserSchema>
export type NoteUserDto = z.infer<typeof NoteUserDtoSchema>
export type NoteUserRow = z.infer<typeof NoteUserRowSchema>
