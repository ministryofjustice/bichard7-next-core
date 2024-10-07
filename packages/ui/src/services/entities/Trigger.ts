import type { Relation } from "typeorm"
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import type { ResolutionStatus } from "types/ResolutionStatus"
import getTriggerWithDescription from "../../utils/formatReasons/getTriggerWithDescription"
// eslint-disable-next-line import/no-cycle
import CourtCase from "./CourtCase"
import dateTransformer from "./transformers/dateTransformer"
import getShortTriggerCode from "./transformers/getShortTriggerCode"
import resolutionStatusTransformer from "./transformers/resolutionStatusTransformer"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

@Entity({ name: "error_list_triggers" })
export default class Trigger {
  @PrimaryColumn({ name: "trigger_id" })
  triggerId!: number

  @Column({ name: "trigger_code", type: "enum", enum: TriggerCode })
  triggerCode!: TriggerCode

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

  public shortTriggerCode: string | null = null

  public description: string | null = null

  @AfterLoad()
  populateShortTriggerCode() {
    this.shortTriggerCode = getShortTriggerCode(this.triggerCode)
  }

  @AfterLoad()
  populateDescription() {
    this.description = getTriggerWithDescription(this.triggerCode)
  }
}
