import config from "lib/config"
import getEmailer from "lib/getEmailer"
import type PromiseResult from "types/PromiseResult"
import logger from "utils/logger"

const postFeedback = (feedback: string, satistactionRating: string, currentUserEmail?: string): PromiseResult<void> => {
  const sendFeedbackTo = config.supportCJSMEmail

  const emailer = getEmailer(sendFeedbackTo)
  const fromUser = currentUserEmail ? `User ${currentUserEmail}` : "An unknown user"
  const emailContent = {
    subject: "New Feedback",
    html: "",
    text: `${fromUser} has written the following feedback: '${feedback}',
    and given the following rating '${satistactionRating}'`
  }

  return emailer
    .sendMail({
      from: config.emailFrom,
      to: sendFeedbackTo,
      ...emailContent
    })
    .then(() => logger.info("Feedback successfully sent"))
    .catch((error: Error) => {
      logger.error({ error: error }, "Error sending email")
      return error
    })
}

export default postFeedback
