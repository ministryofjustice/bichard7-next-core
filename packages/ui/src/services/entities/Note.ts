/* eslint-disable import/no-cycle */
import type { Relation } from "typeorm"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import CourtCase from "./CourtCase"
import User from "./User"
import dateTransformer from "./transformers/dateTransformer"

@Entity({ name: "error_list_notes" })
export default class Note {
  @PrimaryColumn({ name: "note_id" })
  noteId!: number

  @Column({ name: "note_text" })
  noteText!: string

  @Column({ name: "error_id" })
  errorId?: number

  @Column({ name: "user_id" })
  userId!: string

  userFullName?: string

  @Column({ name: "create_ts", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "username" })
  user!: Relation<User>

  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>
}
