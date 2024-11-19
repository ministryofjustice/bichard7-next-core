import type Note from "services/entities/Note"

import type { DisplayPartialUser } from "./Users"

export type DisplayNote = {
  createdAt: string
  user?: DisplayPartialUser
} & Pick<Note, "noteText" | "userFullName" | "userId">
