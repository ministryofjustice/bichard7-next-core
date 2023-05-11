import { Column, Entity, PrimaryColumn } from "typeorm"
import type GroupName from "../../types/GroupName"
import type { KeyValuePair } from "../../types/KeyValuePair"
import BaseEntity from "./BaseEntity"
import delimitedPrefixedString from "./transformers/delimitedPrefixedString"
import featureFlagTransformer from "./transformers/featureFlagTransformer"

@Entity({ name: "users" })
export default class User extends BaseEntity {
  @PrimaryColumn("varchar")
  username!: string

  @Column("varchar")
  password!: string

  @Column("varchar")
  email!: string

  @Column("varchar")
  forenames?: string

  @Column("varchar")
  surname?: string

  @Column({ name: "visible_forces", transformer: delimitedPrefixedString(",", "0"), type: "varchar" })
  visibleForces!: string[]

  @Column({ name: "visible_courts", transformer: delimitedPrefixedString(",", "0"), type: "varchar" })
  visibleCourts!: string[]

  @Column({ name: "feature_flags", transformer: featureFlagTransformer, type: "jsonb" })
  featureFlags!: KeyValuePair<string, boolean>

  groups: GroupName[] = []

  get canLockTriggers() {
    return this.groups.some(
      (group) =>
        group === "TriggerHandler" || group === "GeneralHandler" || group === "Allocator" || group === "Supervisor"
    )
  }

  get canLockExceptions() {
    return this.groups.some(
      (group) =>
        group === "ExceptionHandler" || group === "GeneralHandler" || group === "Allocator" || group === "Supervisor"
    )
  }

  get isSupervisor() {
    return this.groups.some((group) => group === "Supervisor")
  }

  get visibleCases() {
    return this.visibleForces.concat(this.visibleCourts)
  }
}
