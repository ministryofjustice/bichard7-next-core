import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"

import Permission from "@moj-bichard7/common/types/Permission"
import { userAccess } from "@moj-bichard7/common/utils/userPermissions"
import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, Relation } from "typeorm"

import delimitedString from "./transformers/delimitedString"
import jsonTransformer from "./transformers/jsonTransformer"
// eslint-disable-next-line import/no-cycle
import Note from "./Note"
// eslint-disable-next-line import/no-cycle
import SurveyFeedback from "./SurveyFeedback"

@Entity({ name: "users" })
export default class User {
  @Column()
  email!: string

  @Column({ name: "excluded_triggers", transformer: delimitedString(","), type: "varchar" })
  excludedTriggers!: string[]

  @Column({ name: "feature_flags", transformer: jsonTransformer, type: "jsonb" })
  featureFlags!: Record<string, boolean>

  @Column()
  forenames?: string

  groups: UserGroup[] = []

  @PrimaryColumn()
  id!: number

  @OneToMany(() => Note, (note) => note.user)
  @JoinColumn({ name: "user_id" })
  notes!: Relation<Note>[]

  @Column()
  password!: string

  @Column()
  surname?: string

  @OneToMany(() => SurveyFeedback, (surveyFeedback) => surveyFeedback.user)
  @JoinColumn({ name: "user_id" })
  surveyFeedback!: Relation<User>[]

  @PrimaryColumn()
  username!: string

  @Column({ name: "visible_courts", transformer: delimitedString(","), type: "varchar" })
  visibleCourts!: string[]

  @Column({ name: "visible_forces", transformer: delimitedString(","), type: "varchar" })
  visibleForces!: string[]

  get hasAccessTo(): { [key in Permission]: boolean } {
    return userAccess(this)
  }
}
