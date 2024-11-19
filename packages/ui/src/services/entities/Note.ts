/* eslint-disable import/no-cycle */
import type { Relation } from "typeorm"

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

import CourtCase from "./CourtCase"
import dateTransformer from "./transformers/dateTransformer"
import User from "./User"

@Entity({ name: "error_list_notes" })
export default class Note {
  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>

  @Column({ name: "create_ts", transformer: dateTransformer, type: "timestamp" })
  createdAt!: Date

  @Column({ name: "error_id" })
  errorId?: number

  @PrimaryColumn({ name: "note_id" })
  noteId!: number

  @Column({ name: "note_text" })
  noteText!: string

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id", referencedColumnName: "username" })
  user!: Relation<User>

  userFullName?: string

  @Column({ name: "user_id" })
  userId!: string
}
