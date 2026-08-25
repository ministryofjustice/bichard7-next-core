import { emailFrom, supportCJSMEmail } from "@/config"
import type PromiseResult from "@/types/PromiseResult"
import logger from "utils/logger"
import getEmailer from "./getEmailer"

const sendFeedbackEmail = (
  experienceRating: string,
  feedback: string,
  userEmail?: string | null
): PromiseResult<void> => {
  const sendFeedbackTo = supportCJSMEmail

  const emailer = getEmailer(sendFeedbackTo)

  const contactPreference = userEmail ? `Yes, ${userEmail}` : "No"

  const emailContent = {
    subject: "Bichard7 General Feedback",
    html: "",
    text: `Happy to be contacted: ${contactPreference}
    Rating: ${experienceRating}
    Feedback: ${feedback}
    `
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
