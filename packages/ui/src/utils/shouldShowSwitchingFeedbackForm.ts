import { addHours } from "date-fns"
import { SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS } from "../config"

const shouldShowSwitchingFeedbackForm = (lastFeedbackFormSubmission?: Date) => {
  const date = new Date()
  const utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  )
  const hoursBehindInMs = addHours(utcDate, -SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS).getTime()

  return !lastFeedbackFormSubmission || lastFeedbackFormSubmission.getTime() < hoursBehindInMs
}

export default shouldShowSwitchingFeedbackForm
