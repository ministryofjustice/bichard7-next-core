import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, Relation } from "typeorm"

import Note from "./Note"
import SurveyFeedback from "./SurveyFeedback"
import dateTransformer from "./transformers/dateTransformer"
import delimitedString from "./transformers/delimitedString"
import jsonTransformer from "./transformers/jsonTransformer"

@Entity({ name: "users" })
export default class User {
  @Column({ name: "deleted_at", transformer: dateTransformer, type: "timestamptz" })
  deletedAt?: string

  @Column({ type: "varchar" })
  email!: string

  @Column({ name: "excluded_triggers", transformer: delimitedString(","), type: "varchar" })
  excludedTriggers!: string[]

  @Column({ name: "feature_flags", transformer: jsonTransformer, type: "jsonb" })
  featureFlags!: Record<string, boolean>

  @Column({ type: "varchar" })
  forenames?: string

  groups: UserGroup[] = []

  @PrimaryColumn({ type: "int" })
  id!: number

  @JoinColumn({ name: "user_id" })
  @OneToMany(() => Note, (note) => note.user)
  notes!: Relation<Note>[]

  @Column({ type: "varchar" })
  password!: string

  @Column({ type: "varchar" })
  surname?: string

  @JoinColumn({ name: "user_id" })
  @OneToMany(() => SurveyFeedback, (surveyFeedback) => surveyFeedback.user)
  surveyFeedback!: Relation<User>[]

  @PrimaryColumn({ type: "varchar" })
  username!: string

  @Column({ name: "visible_courts", transformer: delimitedString(","), type: "varchar" })
  visibleCourts!: string[]

  @Column({ name: "visible_forces", transformer: delimitedString(","), type: "varchar" })
  visibleForces!: string[]

  get hasAccessTo(): { [key in Permission]: boolean } {
    return userAccess(this)
  }
}
