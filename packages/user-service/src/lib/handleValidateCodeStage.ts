import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import type { ParsedUrlQuery } from "querystring"
import type AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import type CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import type Database from "types/Database"
import { isError } from "types/Result"
import type ServiceMessage from "types/ServiceMessage"
import validateUserVerificationCode from "useCases/validateUserVerificationCode"
import logger from "utils/logger"
import type UserAuthBichard from "../types/UserAuthBichard"
import config from "./config"

interface Props {
  emailAddress?: string
  csrfToken: string
  loginStage?: string
  validationCode?: string
  invalidCodeError?: string
  serviceMessages: ServiceMessage[]
  incorrectDelay: number
}

type ValidateStageConfig = {
  stageKey: "loginStage" | "resetStage"
  onSuccess: (
    connection: Database,
    context: GetServerSidePropsContext<ParsedUrlQuery>,
    user: UserAuthBichard,
    emailAddress: string,
    validationCode: string
  ) => Promise<GetServerSidePropsResult<Props>>
}

export const handleValidateCodeStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database,
  { stageKey, onSuccess }: ValidateStageConfig
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { emailAddress, validationCode } = formData as {
    emailAddress: string
    validationCode: string
  }

  if (!validationCode) {
    return {
      props: {
        invalidCodeError: "Enter a security code",
        emailAddress,
        csrfToken,
        [stageKey]: "validateCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  const user = await validateUserVerificationCode(connection, emailAddress, validationCode)

  if (isError(user)) {
    logger.error(`Error validating code for user [${emailAddress}]: ${user.message}`)
    return {
      props: {
        invalidCodeError: "Incorrect security code",
        emailAddress,
        csrfToken,
        [stageKey]: "validateCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  return onSuccess(connection, context, user, emailAddress, validationCode)
}
