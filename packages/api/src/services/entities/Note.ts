import type { Relation } from "typeorm"

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

import CourtCase from "./CourtCase"
import dateTransformer from "./transformers/dateTransformer"
import User from "./User"

@Entity({ name: "error_list_notes" })
export default class Note {
  @JoinColumn({ name: "error_id" })
  @ManyToOne(() => CourtCase)
  courtCase!: Relation<CourtCase>

  @Column({ name: "create_ts", transformer: dateTransformer, type: "timestamp" })
  createdAt!: Date

  @Column({ name: "error_id", type: "int" })
  errorId?: number

  @PrimaryColumn({ name: "note_id", type: "int" })
  noteId!: number

  @Column({ name: "note_text", type: "varchar" })
  noteText!: string

  @JoinColumn({ name: "user_id", referencedColumnName: "username" })
  @ManyToOne(() => User)
  user!: Relation<User>

  userFullName?: string

  @Column({ name: "user_id", type: "varchar" })
  userId!: string
}
