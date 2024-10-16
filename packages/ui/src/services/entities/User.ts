import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, Relation } from "typeorm"
import Permission from "types/Permission"
import { UserGroup } from "../../types/UserGroup"
import { userAccess } from "../../utils/userPermissions"
import delimitedString from "./transformers/delimitedString"
import jsonTransformer from "./transformers/jsonTransformer"
// eslint-disable-next-line import/no-cycle
import Note from "./Note"
// eslint-disable-next-line import/no-cycle
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
