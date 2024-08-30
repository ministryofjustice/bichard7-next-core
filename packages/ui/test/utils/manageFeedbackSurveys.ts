import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"
import { InsertResult } from "typeorm"

const deleteFeedback = async () => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(`DELETE FROM br7own.survey_feedback;`)
}

const insertFeedback = async (feedback: Partial<SurveyFeedback> & { username: string }): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  const user = await dataSource.getRepository(User).findOne({ where: { username: feedback.username } })
  if (!user) {
    throw new Error("Nonexistent user in insertFeedback")
  }
  return (await getDataSource()).getRepository(SurveyFeedback).insert({
    userId: user.id,
    response: {},
    feedbackType: 0,
    ...feedback
  })
}

const getAllFeedbacksFromDatabase = async (): Promise<SurveyFeedback[]> => {
  const feedbacks = await (await getDataSource()).getRepository(SurveyFeedback).find({
    relations: { user: true }
  })

  return feedbacks
}

export { deleteFeedback, getAllFeedbacksFromDatabase, insertFeedback }
