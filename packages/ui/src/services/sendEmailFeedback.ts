import { emailFrom, supportCJSMEmail } from "@/config"
import type PromiseResult from "@/types/PromiseResult"
import logger from "utils/logger"
import getEmailer from "./getEmailer"

const sendFeedbackEmail = (isAnonymous: string, experienceRating: string, feedback: string): PromiseResult<void> => {
  const sendFeedbackTo = supportCJSMEmail

  const emailer = getEmailer(sendFeedbackTo)

  const emailContent = {
    subject: "Bichard7 General Feedback",
    html: "",
    text: `Happy to be contacted: ${isAnonymous === "no" ? "Yes" : "No"}\nRating: '${experienceRating}\nFeedback: '${feedback}''`
  }

  return emailer
    .sendMail({
      from: emailFrom,
      to: sendFeedbackTo,
      ...emailContent
    })
    .then(() => logger.info("Feedback successfully sent"))
    .catch((error: Error) => {
      logger.error({ error }, "Error sending feedback email")
      return error
    })
}

export default sendFeedbackEmail
