import type { User } from "@moj-bichard7/common/types/User"

export type NoteUser = Pick<User, UserData>

type UserData = "forenames" | "surname" | "username" | "visible_forces"
