import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, Relation } from "typeorm"
import BaseEntity from "../../services/entities/BaseEntity"
// eslint-disable-next-line import/no-cycle
import CourtCase from "../../services/entities/CourtCase"
import dateTransformer from "../../services/entities/transformers/dateTransformer"
import resolutionStatusTransformer from "../../services/entities/transformers/resolutionStatusTransformer"
import { ResolutionStatus } from "../../types/ResolutionStatus"

@Entity({ name: "error_list_triggers" })
export default class Trigger extends BaseEntity {
  @PrimaryColumn("int4", { name: "trigger_id" })
  triggerId!: number

  @Column("varchar", { name: "trigger_code" })
  triggerCode!: string

  @Column("int4", { name: "error_id" })
  errorId!: number

  @Column({ type: "int4", transformer: resolutionStatusTransformer })
  status!: ResolutionStatus

  @Column({ name: "create_ts", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date

  @Column({ name: "resolved_by", type: "varchar" })
  resolvedBy!: string | null

  @Column({ name: "resolved_ts", type: "timestamp", transformer: dateTransformer })
  resolvedAt!: Date | null

  @Column("varchar", { name: "trigger_item_identity" })
  triggerItemIdentity?: number

  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>
}
