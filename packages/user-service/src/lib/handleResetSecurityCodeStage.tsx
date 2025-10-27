import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Database from "types/Database"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"
import sendVerificationCodeEmail from "useCases/sendVerificationCodeEmail"
import logger from "utils/logger"
import resetUserVerificationCode from "useCases/resetUserVerificationCode"

interface Props {
  emailAddress?: string
  csrfToken: string
  sendingError?: boolean
  loginStage?: string
  validationCode?: string
  serviceMessages: ServiceMessage[]
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
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
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
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return {
    props: {
      csrfToken,
      emailAddress,
      [stageKey]: "validateCode",
      validationCode: "",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
    }
  }
}
