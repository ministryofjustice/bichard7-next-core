import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import type { ParsedUrlQuery } from "querystring"
import type AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import type CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import type Database from "types/Database"
import { isError } from "types/Result"
import type ServiceMessage from "types/ServiceMessage"
import resetUserVerificationCode from "useCases/resetUserVerificationCode"
import sendVerificationCodeEmail from "useCases/sendVerificationCodeEmail"
import logger from "utils/logger"
import config from "./config"

interface Props {
  emailAddress?: string
  csrfToken: string
  sendingError?: boolean
  loginStage?: string
  validationCode?: string
  serviceMessages: ServiceMessage[]
  incorrectDelay: number
}

export const handleResetSecurityCodeStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database,
  stageKey: "loginStage" | "resetStage"
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { emailAddress } = formData as { emailAddress: string }

  const reset = await resetUserVerificationCode(connection, emailAddress)

  if (isError(reset)) {
    logger.error(`Error resetting code for user [${emailAddress}]: ${reset.message}`)
    return {
      props: {
        csrfToken,
        emailAddress,
        sendingError: true,
        [stageKey]: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  const sent = await sendVerificationCodeEmail(connection, emailAddress, stageKey)

  if (isError(sent)) {
    logger.error(sent)
    return {
      props: {
        csrfToken,
        emailAddress,
        sendingError: true,
        [stageKey]: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  return {
    props: {
      csrfToken,
      emailAddress,
      [stageKey]: "validateCode",
      validationCode: "",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
      incorrectDelay: config.incorrectDelay
    }
  }
}
