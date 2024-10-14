import type Note from "services/entities/Note"
import type { DisplayPartialUser } from "./Users"

export type DisplayNote = Pick<Note, "noteText" | "userId" | "userFullName"> & {
  user?: DisplayPartialUser
  createdAt: string
}
