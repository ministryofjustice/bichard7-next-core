import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import { Relation } from "typeorm"
import BaseEntity from "src/services/entities/BaseEntity"
// eslint-disable-next-line import/no-cycle
import CourtCase from "src/services/entities/CourtCase"
import dateTransformer from "src/services/entities/transformers/dateTransformer"

@Entity({ name: "error_list_notes" })
export default class Note extends BaseEntity {
  @PrimaryColumn("int4", { name: "note_id" })
  noteId!: number

  @Column("varchar", { name: "note_text", nullable: true })
  noteText!: string

  @Column("int4", { name: "error_id" })
  errorId?: number

  @Column("int4", { name: "user_id" })
  userId!: string

  @Column({ name: "create_ts", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date

  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>
}
