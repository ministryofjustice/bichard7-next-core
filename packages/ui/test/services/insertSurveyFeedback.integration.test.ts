import type { DataSource } from "typeorm"

import SurveyFeedback from "services/entities/SurveyFeedback"
import getDataSource from "services/getDataSource"
import insertSurveyFeedback from "services/insertSurveyFeedback"
import { isError } from "types/Result"
import { SurveyFeedbackType } from "types/SurveyFeedback"

import deleteFromEntity from "../utils/deleteFromEntity"

describe("insertSurveyFeedback", () => {
  let dataSource: DataSource
  const dummyResponse = { comment: "some comment", experience: 0 }
  const feedbackId = 0

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(SurveyFeedback)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it("should insert a new survey", async () => {
    const feedback = {
      feedbackType: SurveyFeedbackType.General,
      id: feedbackId,
      response: dummyResponse
    }

    const result = await insertSurveyFeedback(dataSource, feedback as SurveyFeedback)

    expect(isError(result)).toBe(false)
    const recordedFeedback = await dataSource.getRepository(SurveyFeedback).findOne({ where: { id: feedbackId } })
    const actualFeedback = recordedFeedback as SurveyFeedback
    expect(actualFeedback.response).toEqual(dummyResponse)
    expect(actualFeedback.feedbackType).toBe(SurveyFeedbackType.General)
  })

  it("Should return the error when the query fails", async () => {
    const nonExistentUserId = 9999
    const feedback = {
      feedbackType: SurveyFeedbackType.General,
      id: feedbackId,
      response: dummyResponse,
      userId: nonExistentUserId
    }

    const result = await insertSurveyFeedback(dataSource, feedback as SurveyFeedback)

    expect(isError(result)).toBe(true)

    const error = result as Error
    expect(error.message).toBe(
      'insert or update on table "survey_feedback" violates foreign key constraint "survey_feedback_user_id_fkey"'
    )
  })
})
