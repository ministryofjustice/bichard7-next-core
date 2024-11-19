import type { Relation } from "typeorm"
import type { ResolutionStatus } from "types/ResolutionStatus"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

import getTriggerWithDescription from "../../utils/formatReasons/getTriggerWithDescription"

// eslint-disable-next-line import/no-cycle
import CourtCase from "./CourtCase"
import dateTransformer from "./transformers/dateTransformer"
import getShortTriggerCode from "./transformers/getShortTriggerCode"
import resolutionStatusTransformer from "./transformers/resolutionStatusTransformer"

@Entity({ name: "error_list_triggers" })
export default class Trigger {
  @ManyToOne(() => CourtCase)
  @JoinColumn({ name: "error_id" })
  courtCase!: Relation<CourtCase>

  @Column({ name: "create_ts", transformer: dateTransformer, type: "timestamp" })
  createdAt!: Date

  public description: null | string = null

  @Column({ name: "error_id" })
  errorId!: number

  @Column({ name: "resolved_ts", transformer: dateTransformer, type: "timestamp" })
  resolvedAt!: Date | null

  @Column({ name: "resolved_by", type: "varchar" })
  resolvedBy!: null | string

  public shortTriggerCode: null | string = null

  @Column({ transformer: resolutionStatusTransformer, type: "int4" })
  status!: ResolutionStatus

  @Column({ enum: TriggerCode, name: "trigger_code", type: "enum" })
  triggerCode!: TriggerCode

  @PrimaryColumn({ name: "trigger_id" })
  triggerId!: number

  @Column({ name: "trigger_item_identity" })
  triggerItemIdentity?: number

  @AfterLoad()
  populateDescription() {
    this.description = getTriggerWithDescription(this.triggerCode)
  }

  @AfterLoad()
  populateShortTriggerCode() {
    this.shortTriggerCode = getShortTriggerCode(this.triggerCode)
  }
}
