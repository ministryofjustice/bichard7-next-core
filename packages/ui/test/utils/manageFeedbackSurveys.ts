import type { InsertResult } from "typeorm"

import SurveyFeedback from "services/entities/SurveyFeedback"
import User from "services/entities/User"
import getDataSource from "services/getDataSource"

const deleteFeedback = async () => {
  const dataSource = await getDataSource()
  return dataSource.manager.query("DELETE FROM br7own.survey_feedback;")
}

const insertFeedback = async (feedback: { username: string } & Partial<SurveyFeedback>): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  const user = await dataSource.getRepository(User).findOne({ where: { username: feedback.username } })
  if (!user) {
    throw new Error("Nonexistent user in insertFeedback")
  }

  return (await getDataSource()).getRepository(SurveyFeedback).insert({
    feedbackType: 0,
    response: {},
    userId: user.id,
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
