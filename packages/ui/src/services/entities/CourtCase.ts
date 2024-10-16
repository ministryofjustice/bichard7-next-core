/* eslint-disable import/no-cycle */
import type { Relation } from "typeorm"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"
import type { ResolutionStatus } from "types/ResolutionStatus"
import Note from "./Note"
import Trigger from "./Trigger"
import User from "./User"
import booleanIntTransformer from "./transformers/booleanIntTransformer"
import dateTransformer from "./transformers/dateTransformer"
import resolutionStatusTransformer from "./transformers/resolutionStatusTransformer"
import Permission from "../../types/Permission"

@Entity({ name: "error_list" })
export default class CourtCase {
  @PrimaryColumn({ name: "error_id" })
  errorId!: number

  @Column({ name: "message_id" })
  messageId!: string

  @Column({ name: "phase" })
  phase!: number

  @Column({ name: "error_status", type: "int4", transformer: resolutionStatusTransformer })
  errorStatus!: ResolutionStatus | null

  @Column({ name: "trigger_status", type: "int4", transformer: resolutionStatusTransformer })
  triggerStatus?: ResolutionStatus | null

  @Column({ name: "error_quality_checked", type: "int4", nullable: true })
  errorQualityChecked!: number | null

  @Column({ name: "trigger_quality_checked", type: "int4", nullable: true })
  triggerQualityChecked!: number | null

  @Column({ name: "trigger_count" })
  triggerCount!: number

  @Column({ name: "is_urgent", type: "int2", transformer: booleanIntTransformer })
  isUrgent!: boolean

  @Column({ name: "asn", type: "varchar", nullable: true })
  asn!: string | null

  @Column({ name: "court_code", type: "varchar", nullable: true })
  courtCode!: string | null

  @Column({ name: "annotated_msg", type: "varchar" })
  hearingOutcome!: string

  @Column({ name: "updated_msg", type: "varchar", nullable: true })
  updatedHearingOutcome!: string | null

  @Column({ name: "error_report" })
  errorReport!: string

  @Column({ name: "create_ts", type: "timestamptz" })
  createdTimestamp!: Date

  @Column({ name: "error_reason", type: "varchar", nullable: true })
  errorReason!: string | null

  @Column({ name: "trigger_reason", type: "varchar", nullable: true })
  triggerReason!: string | null

  @Column({ name: "error_count" })
  errorCount!: number

  @Column({ name: "user_updated_flag", type: "int2", nullable: true })
  userUpdatedFlag!: number | null

  // TODO: only show Date part of this and not time-stamp
  @Column({ name: "court_date", type: "date", nullable: true, transformer: dateTransformer })
  courtDate!: Date | null

  @Column({ name: "ptiurn" })
  ptiurn!: string

  @Column({ name: "court_name" })
  courtName!: string

  @Column({ name: "resolution_ts", type: "timestamptz", nullable: true, transformer: dateTransformer })
  resolutionTimestamp!: Date | null

  @Column({ name: "msg_received_ts", type: "timestamptz", transformer: dateTransformer })
  messageReceivedTimestamp!: Date

  @Column({ name: "error_resolved_by", type: "varchar", nullable: true })
  errorResolvedBy!: string | null

  @Column({ name: "trigger_resolved_by", type: "varchar", nullable: true })
  triggerResolvedBy!: string | null

  @Column({ name: "error_resolved_ts", type: "timestamptz", nullable: true, transformer: dateTransformer })
  errorResolvedTimestamp!: Date | null

  @Column({ name: "trigger_resolved_ts", type: "timestamptz", nullable: true, transformer: dateTransformer })
  triggerResolvedTimestamp!: Date | null

  @Column({ name: "defendant_name", type: "varchar", nullable: true })
  defendantName!: string | null

  @Column({ name: "org_for_police_filter", type: "varchar", nullable: true })
  orgForPoliceFilter!: string | null

  @Column({ name: "court_room", type: "varchar", nullable: true })
  courtRoom!: string | null

  @Column({ name: "court_reference" })
  courtReference!: string

  @Column({ name: "error_insert_ts", type: "timestamptz", nullable: true, transformer: dateTransformer })
  errorInsertedTimestamp!: Date | null

  @Column({ name: "trigger_insert_ts", type: "timestamptz", nullable: true, transformer: dateTransformer })
  triggerInsertedTimestamp!: Date | null

  @Column({ name: "pnc_update_enabled", type: "varchar", nullable: true })
  pncUpdateEnabled!: string | null

  @OneToMany(() => Trigger, (trigger) => trigger.courtCase, { eager: true, cascade: ["insert", "update"] })
  triggers!: Relation<Trigger>[]

  @ManyToOne(() => User)
  @JoinColumn({ name: "error_locked_by_id", referencedColumnName: "username" })
  errorLockedByUser!: User | null

  @Column({ name: "error_locked_by_id", type: "varchar", nullable: true })
  errorLockedByUsername?: string | null

  errorLockedByUserFullName?: string | null

  @ManyToOne(() => User)
  @JoinColumn({ name: "trigger_locked_by_id", referencedColumnName: "username" })
  triggerLockedByUser!: User | null

  @Column({ name: "trigger_locked_by_id", type: "varchar", nullable: true })
  triggerLockedByUsername?: string | null

  triggerLockedByUserFullName?: string | null

  @OneToMany(() => Note, (note) => note.courtCase, { eager: true, cascade: ["insert", "update"] })
  notes!: Relation<Note>[]

  exceptionsAreLockedByAnotherUser(username: string) {
    return !!this.errorLockedByUsername && this.errorLockedByUsername !== username
  }

  triggersAreLockedByAnotherUser(username: string) {
    return !!this.triggerLockedByUsername && this.triggerLockedByUsername !== username
  }

  isLockedByAnotherUser(username: string) {
    return this.exceptionsAreLockedByAnotherUser(username) || this.triggersAreLockedByAnotherUser(username)
  }

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

  triggersAreLockedByCurrentUser(username: string) {
    return !!this.triggerLockedByUsername && this.triggerLockedByUsername === username
  }

  exceptionsAreLockedByCurrentUser(username: string) {
    return !!this.errorLockedByUsername && this.errorLockedByUsername === username
  }

  isLockedByCurrentUser(username: string) {
    return this.triggersAreLockedByCurrentUser(username) || this.exceptionsAreLockedByCurrentUser(username)
  }
}
