import z from "zod"

export const NoteApiSchema = z.object({
  noteText: z.string()
})
