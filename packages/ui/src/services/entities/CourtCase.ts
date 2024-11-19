import type { Relation } from "typeorm"
import type { ResolutionStatus } from "types/ResolutionStatus"

/* eslint-disable import/no-cycle */
import Permission from "@moj-bichard7/common/types/Permission"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"

import Note from "./Note"
import booleanIntTransformer from "./transformers/booleanIntTransformer"
import dateTransformer from "./transformers/dateTransformer"
import resolutionStatusTransformer from "./transformers/resolutionStatusTransformer"
import Trigger from "./Trigger"
import User from "./User"

@Entity({ name: "error_list" })
export default class CourtCase {
  @Column({ name: "asn", nullable: true, type: "varchar" })
  asn!: null | string

  @Column({ name: "court_code", nullable: true, type: "varchar" })
  courtCode!: null | string

  // TODO: only show Date part of this and not time-stamp
  @Column({ name: "court_date", nullable: true, transformer: dateTransformer, type: "date" })
  courtDate!: Date | null

  @Column({ name: "court_name" })
  courtName!: string

  @Column({ name: "court_reference" })
  courtReference!: string

  @Column({ name: "court_room", nullable: true, type: "varchar" })
  courtRoom!: null | string

  @Column({ name: "create_ts", type: "timestamptz" })
  createdTimestamp!: Date

  @Column({ name: "defendant_name", nullable: true, type: "varchar" })
  defendantName!: null | string

  @Column({ name: "error_count" })
  errorCount!: number

  @PrimaryColumn({ name: "error_id" })
  errorId!: number

  @Column({ name: "error_insert_ts", nullable: true, transformer: dateTransformer, type: "timestamptz" })
  errorInsertedTimestamp!: Date | null

  @ManyToOne(() => User)
  @JoinColumn({ name: "error_locked_by_id", referencedColumnName: "username" })
  errorLockedByUser!: null | User

  errorLockedByUserFullName?: null | string

  @Column({ name: "error_locked_by_id", nullable: true, type: "varchar" })
  errorLockedByUsername?: null | string

  @Column({ name: "error_quality_checked", nullable: true, type: "int4" })
  errorQualityChecked!: null | number

  @Column({ name: "error_reason", nullable: true, type: "varchar" })
  errorReason!: null | string

  @Column({ name: "error_report" })
  errorReport!: string

  @Column({ name: "error_resolved_by", nullable: true, type: "varchar" })
  errorResolvedBy!: null | string

  @Column({ name: "error_resolved_ts", nullable: true, transformer: dateTransformer, type: "timestamptz" })
  errorResolvedTimestamp!: Date | null

  @Column({ name: "error_status", transformer: resolutionStatusTransformer, type: "int4" })
  errorStatus!: null | ResolutionStatus

  @Column({ name: "annotated_msg", type: "varchar" })
  hearingOutcome!: string

  @Column({ name: "is_urgent", transformer: booleanIntTransformer, type: "int2" })
  isUrgent!: boolean

  @Column({ name: "message_id" })
  messageId!: string

  @Column({ name: "msg_received_ts", transformer: dateTransformer, type: "timestamptz" })
  messageReceivedTimestamp!: Date

  @OneToMany(() => Note, (note) => note.courtCase, { cascade: ["insert", "update"], eager: true })
  notes!: Relation<Note>[]

  @Column({ name: "org_for_police_filter", nullable: true, type: "varchar" })
  orgForPoliceFilter!: null | string

  @Column({ name: "phase" })
  phase!: number

  @Column({ name: "pnc_update_enabled", nullable: true, type: "varchar" })
  pncUpdateEnabled!: null | string

  @Column({ name: "ptiurn" })
  ptiurn!: string

  @Column({ name: "resolution_ts", nullable: true, transformer: dateTransformer, type: "timestamptz" })
  resolutionTimestamp!: Date | null

  @Column({ name: "trigger_count" })
  triggerCount!: number

  @Column({ name: "trigger_insert_ts", nullable: true, transformer: dateTransformer, type: "timestamptz" })
  triggerInsertedTimestamp!: Date | null

  @ManyToOne(() => User)
  @JoinColumn({ name: "trigger_locked_by_id", referencedColumnName: "username" })
  triggerLockedByUser!: null | User

  triggerLockedByUserFullName?: null | string

  @Column({ name: "trigger_locked_by_id", nullable: true, type: "varchar" })
  triggerLockedByUsername?: null | string

  @Column({ name: "trigger_quality_checked", nullable: true, type: "int4" })
  triggerQualityChecked!: null | number

  @Column({ name: "trigger_reason", nullable: true, type: "varchar" })
  triggerReason!: null | string

  @Column({ name: "trigger_resolved_by", nullable: true, type: "varchar" })
  triggerResolvedBy!: null | string

  @Column({ name: "trigger_resolved_ts", nullable: true, transformer: dateTransformer, type: "timestamptz" })
  triggerResolvedTimestamp!: Date | null

  @OneToMany(() => Trigger, (trigger) => trigger.courtCase, { cascade: ["insert", "update"], eager: true })
  triggers!: Relation<Trigger>[]

  @Column({ name: "trigger_status", transformer: resolutionStatusTransformer, type: "int4" })
  triggerStatus?: null | ResolutionStatus

  @Column({ name: "updated_msg", nullable: true, type: "varchar" })
  updatedHearingOutcome!: null | string

  @Column({ name: "user_updated_flag", nullable: true, type: "int2" })
  userUpdatedFlag!: null | number

  canReallocate(username: string) {
    const canReallocateAsExceptionHandler =
      !this.exceptionsAreLockedByAnotherUser(username) && this.errorStatus === "Unresolved"
    const canReallocateAsTriggerHandler =
      !this.triggersAreLockedByAnotherUser(username) &&
      this.triggerStatus === "Unresolved" &&
      this.errorStatus !== "Unresolved" &&
      this.errorStatus !== "Submitted"

    return canReallocateAsExceptionHandler || canReallocateAsTriggerHandler
  }

  canResolveOrSubmit(user: User) {
    const canResolveOrSubmit =
      this.exceptionsAreLockedByCurrentUser(user.username) &&
      this.errorStatus === "Unresolved" &&
      user.hasAccessTo[Permission.Exceptions] &&
      !!user.featureFlags.exceptionsEnabled

    return canResolveOrSubmit
  }

  exceptionsAreLockedByAnotherUser(username: string) {
    return !!this.errorLockedByUsername && this.errorLockedByUsername !== username
  }

  exceptionsAreLockedByCurrentUser(username: string) {
    return !!this.errorLockedByUsername && this.errorLockedByUsername === username
  }

  isLockedByAnotherUser(username: string) {
    return this.exceptionsAreLockedByAnotherUser(username) || this.triggersAreLockedByAnotherUser(username)
  }

  isLockedByCurrentUser(username: string) {
    return this.triggersAreLockedByCurrentUser(username) || this.exceptionsAreLockedByCurrentUser(username)
  }

  triggersAreLockedByAnotherUser(username: string) {
    return !!this.triggerLockedByUsername && this.triggerLockedByUsername !== username
  }

  triggersAreLockedByCurrentUser(username: string) {
    return !!this.triggerLockedByUsername && this.triggerLockedByUsername === username
  }
}
