import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, type Relation } from "typeorm"
import type { SurveyFeedbackResponse, SwitchingFeedbackResponse } from "types/SurveyFeedback"
import { SurveyFeedbackType } from "../../types/SurveyFeedback"
// eslint-disable-next-line import/no-cycle
import User from "./User"
import dateTransformer from "./transformers/dateTransformer"
import jsonTransformer from "./transformers/jsonTransformer"

@Entity({ name: "survey_feedback" })
export default class SurveyFeedback {
  @PrimaryColumn()
  id!: number

  @Column({ transformer: jsonTransformer, type: "jsonb" })
  response!: SurveyFeedbackResponse | SwitchingFeedbackResponse

  @Column({ type: "enum", enum: SurveyFeedbackType, name: "feedback_type" })
  feedbackType!: SurveyFeedbackType

  @Column({ name: "user_id" })
  userId?: number

  @Column({ name: "created_at", type: "timestamp", transformer: dateTransformer })
  createdAt!: Date

  @ManyToOne(() => User, (user) => user.surveyFeedback)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user!: Relation<User>
}
