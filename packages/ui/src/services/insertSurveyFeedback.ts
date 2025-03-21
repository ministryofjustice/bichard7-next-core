import SurveyFeedback from "services/entities/SurveyFeedback"
import type { DataSource, InsertResult } from "typeorm"
import type PromiseResult from "types/PromiseResult"

const insertSurveyFeedback = async (
  dataSource: DataSource,
  feedback: SurveyFeedback
): PromiseResult<InsertResult | Error> => {
  const surveyRepository = dataSource.getRepository(SurveyFeedback)
  const insertResult = await surveyRepository
    .createQueryBuilder()
    .insert()
    .into(SurveyFeedback)
    .values(feedback)
    .execute()
    .catch((error: Error) => error)

  return insertResult
}

export default insertSurveyFeedback
