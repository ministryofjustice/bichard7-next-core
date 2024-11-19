import type { SurveyFeedbackResponse, SwitchingFeedbackResponse } from "types/SurveyFeedback"

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from "typeorm"

import { SurveyFeedbackType } from "../../types/SurveyFeedback"
import dateTransformer from "./transformers/dateTransformer"
import jsonTransformer from "./transformers/jsonTransformer"
// eslint-disable-next-line import/no-cycle
import User from "./User"

@Entity({ name: "survey_feedback" })
export default class SurveyFeedback {
  @Column({ name: "created_at", transformer: dateTransformer, type: "timestamp" })
  createdAt!: Date

  @Column({ enum: SurveyFeedbackType, name: "feedback_type", type: "enum" })
  feedbackType!: SurveyFeedbackType

  @PrimaryColumn()
  id!: number

  @Column({ transformer: jsonTransformer, type: "jsonb" })
  response!: SurveyFeedbackResponse | SwitchingFeedbackResponse

  @ManyToOne(() => User, (user) => user.surveyFeedback)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: Relation<User>

  @Column({ name: "user_id" })
  userId?: number
}
