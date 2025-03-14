import Permission from "@moj-bichard7/common/types/Permission"
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, Relation } from "typeorm"

import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import delimitedString from "./transformers/delimitedString"
import jsonTransformer from "./transformers/jsonTransformer"

import Note from "./Note"

import SurveyFeedback from "./SurveyFeedback"

@Entity({ name: "users" })
export default class User {
  @PrimaryColumn()
  id!: number

  @PrimaryColumn()
  username!: string

  @Column()
  password!: string

  @Column()
  email!: string

  @Column()
  forenames?: string

  @Column()
  surname?: string

  @Column({ name: "visible_forces", transformer: delimitedString(","), type: "varchar" })
  visibleForces!: string[]

  @Column({ name: "visible_courts", transformer: delimitedString(","), type: "varchar" })
  visibleCourts!: string[]

  @Column({ name: "excluded_triggers", transformer: delimitedString(","), type: "varchar" })
  excludedTriggers!: string[]

  @Column({ name: "feature_flags", transformer: jsonTransformer, type: "jsonb" })
  featureFlags!: Record<string, boolean>

  @OneToMany(() => Note, (note) => note.user)
  @JoinColumn({ name: "user_id" })
  notes!: Relation<Note>[]

  @OneToMany(() => SurveyFeedback, (surveyFeedback) => surveyFeedback.user)
  @JoinColumn({ name: "user_id" })
  surveyFeedback!: Relation<User>[]

  groups: UserGroup[] = []

  get hasAccessTo(): { [key in Permission]: boolean } {
    return userAccess(this)
  }
}
