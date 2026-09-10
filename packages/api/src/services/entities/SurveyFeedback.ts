import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from "typeorm"

import { SurveyFeedbackResponse, SurveyFeedbackType, SwitchingFeedbackResponse } from "../../types/SurveyFeedback"
import dateTransformer from "./transformers/dateTransformer"
import jsonTransformer from "./transformers/jsonTransformer"
import User from "./User"

@Entity({ name: "survey_feedback" })
export default class SurveyFeedback {
  @Column({ name: "created_at", transformer: dateTransformer, type: "timestamp" })
  createdAt!: Date

  @Column({ enum: SurveyFeedbackType, name: "feedback_type", type: "enum" })
  feedbackType!: SurveyFeedbackType

  @PrimaryColumn({ type: "int" })
  id!: number

  @Column({ transformer: jsonTransformer, type: "jsonb" })
  response!: SurveyFeedbackResponse | SwitchingFeedbackResponse

  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  @ManyToOne(() => User, (user) => user.surveyFeedback)
  user!: Relation<User>

  @Column({ name: "user_id", type: "int" })
  userId?: number
}
