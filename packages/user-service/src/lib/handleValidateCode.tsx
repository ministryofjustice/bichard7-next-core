import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Database from "types/Database"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"
import logger from "utils/logger"
import validateUserVerificationCode from "useCases/validateUserVerificationCode"
import UserAuthBichard from "../types/UserAuthBichard"

interface Props {
  emailAddress?: string
  csrfToken: string
  loginStage?: string
  validationCode?: string
  invalidCodeError?: string
  serviceMessages: ServiceMessage[]
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

export const handleValidateCode = async (
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
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
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
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return onSuccess(connection, context, user, emailAddress, validationCode)
}
