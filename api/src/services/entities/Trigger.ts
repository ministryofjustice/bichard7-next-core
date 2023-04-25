import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import type { Relation } from "typeorm"
import BaseEntity from "./BaseEntity"
// eslint-disable-next-line import/no-cycle
import CourtCase from "./CourtCase"
import dateTransformer from "./transformers/dateTransformer"
import type { ResolutionStatus } from "../../types/ResolutionStatus"
import resolutionStatusTransformer from "./transformers/resolutionStatusTransformer"

@Entity({ name: "error_list_triggers" })
export default class Trigger extends BaseEntity {
  @PrimaryColumn({ name: "trigger_id" })
  triggerId!: number

  @Column({ name: "trigger_code" })
  triggerCode!: string

  @Column({ name: "error_id" })
  errorId!: number

  @Column({ type: "int4", transformer: resolutionStatusTransformer })
  status!: ResolutionStatus

  @Column({ name: "create_ts", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date

  @Column({ name: "resolved_by", type: "varchar" })
  resolvedBy!: string | null

  @Column({ name: "resolved_ts", type: "timestamp", transformer: dateTransformer })
  resolvedAt!: Date | null

  @Column({ name: "trigger_item_identity" })
  triggerItemIdentity?: number

  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>
}
