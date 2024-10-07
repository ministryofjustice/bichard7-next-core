import { DataSource } from "typeorm"
import { isError } from "types/Result"
import SurveyFeedback from "./entities/SurveyFeedback"

const getLastSwitchingFormSubmission = async (dataSource: DataSource, userId: number) => {
  const feedback = await dataSource
    .getRepository(SurveyFeedback)
    .findOne({ where: { userId }, order: { createdAt: "DESC" } })
    .catch((error: Error) => error)

  if (isError(feedback)) {
    return feedback
  }

  return feedback?.createdAt ?? null
}

export default getLastSwitchingFormSubmission
