import type { ResolutionStatus } from "@moj-bichard7/common/types/ResolutionStatus"
import type { Relation } from "typeorm"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import getShortTriggerCode from "@moj-bichard7/common/utils/getShortTriggerCode"
import getTriggerWithDescription from "@moj-bichard7/common/utils/getTriggerWithDescription"
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"

import CourtCase from "./CourtCase"
import dateTransformer from "./transformers/dateTransformer"
import resolutionStatusTransformer from "./transformers/resolutionStatusTransformer"
import varcharToNumberTransformer from "./transformers/varcharToNumberTransformer"

@Entity({ name: "error_list_triggers" })
export default class Trigger {
  @JoinColumn({ name: "error_id" })
  @ManyToOne(() => CourtCase)
  courtCase!: Relation<CourtCase>

  @Column({ name: "create_ts", transformer: dateTransformer, type: "timestamp" })
  createdAt!: Date

  public description: null | string = null

  @Column({ name: "error_id", type: "int" })
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

  @PrimaryColumn({ name: "trigger_id", type: "int" })
  triggerId!: number

  @Column({ name: "trigger_item_identity", transformer: varcharToNumberTransformer, type: "varchar" })
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
