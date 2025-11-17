import BackLink from "components/BackLink"
import BulletList from "components/BulletList"
import Button from "components/Button"
import ContactLink from "components/ContactLink"
import { ErrorSummaryList } from "components/ErrorSummary"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import Form from "components/Form"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import ResendSecurityCodeForm from "components/Login/ResendSecurityCodeForm"
import ResetPasswordFormGroup from "components/Login/ResetPasswordFormGroup"
import ValidateCodeForm from "components/Login/ValidateCodeForm"
import Paragraph from "components/Paragraph"
import ServiceMessages from "components/ServiceMessages"
import TextInput from "components/TextInput"
import { removeCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getAuditLogger from "lib/getAuditLogger"
import getConnection from "lib/getConnection"
import { handleValidateCodeStage } from "lib/handleValidateCodeStage"
import { withCsrf } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Database from "types/Database"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"
import { getEmailAddressFromCookie, removeEmailAddressCookie, storeEmailAddressInCookie } from "useCases"
import getServiceMessages from "useCases/getServiceMessages"
import passwordSecurityCheck from "useCases/passwordSecurityCheck"
import resetPassword, { ResetPasswordOptions } from "useCases/resetPassword"
import sendVerificationCodeEmail from "useCases/sendVerificationCodeEmail"
import createRedirectResponse from "utils/createRedirectResponse"
import { isGet, isPost } from "utils/http"
import logger from "utils/logger"
import { handleResetSecurityCodeStage } from "../../lib/handleResetSecurityCodeStage"
import UserAuthBichard from "../../types/UserAuthBichard"

const handleEmailStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { emailAddress } = formData as { emailAddress: string }

  const emailIsValid = !!emailAddress.match(/\S+@\S+\.\S+/)
  const hasEmail = !!emailAddress

  let emailError: string | undefined

  if (!hasEmail) {
    emailError = "Enter your email address"
  } else if (!emailIsValid) {
    emailError = "Enter an email address in the correct format, for example name@example.com"
  }

  if (emailError) {
    return {
      props: {
        csrfToken,
        emailAddress,
        emailError,
        resetStage: "email",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  const normalisedEmail = removeCjsmSuffix(emailAddress)
  const sent = await sendVerificationCodeEmail(connection, normalisedEmail, "resetStage")

  if (isError(sent)) {
    logger.error(sent)
    return {
      props: {
        csrfToken,
        emailAddress: normalisedEmail,
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  const { res } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  storeEmailAddressInCookie(res, config, normalisedEmail, "IN_PROGRESS")

  return {
    props: {
      csrfToken,
      emailAddress: normalisedEmail,
      resetStage: "validateCode",
      validationCode: "",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
      incorrectDelay: config.incorrectDelay
    }
  }
}

const handleNewPasswordStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { emailAddress, validationCode, newPassword, confirmPassword } = formData as {
    emailAddress: string
    validationCode: string
    newPassword: string
    confirmPassword: string
  }

  let invalidPassword = false
  let passwordsMismatch = false
  let passwordInsecure = false
  let passwordInsecureMessage: string | undefined

  if (!newPassword) {
    invalidPassword = true
  }

  if (newPassword && newPassword !== confirmPassword) {
    passwordsMismatch = true
  }

  if (!invalidPassword && !passwordsMismatch) {
    const passwordCheckResult = passwordSecurityCheck(newPassword)
    if (isError(passwordCheckResult)) {
      logger.error(passwordCheckResult.message)
      passwordInsecure = true
      passwordInsecureMessage = passwordCheckResult.message
    }
  }

  if (invalidPassword || passwordsMismatch || passwordInsecure) {
    return {
      props: {
        csrfToken,
        emailAddress,
        validationCode,
        resetStage: "newPassword",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        ...(invalidPassword && { invalidPassword: true }),
        ...(passwordsMismatch && { passwordsMismatch: true }),
        ...(passwordInsecure && { passwordInsecure: true, passwordInsecureMessage }),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  const auditLogger = getAuditLogger(context, config)
  const resetPasswordOptions: ResetPasswordOptions = {
    emailAddress,
    passwordResetCode: validationCode,
    newPassword
  }
  const resetPasswordResult = await resetPassword(connection, auditLogger, resetPasswordOptions)

  if (isError(resetPasswordResult)) {
    logger.error(`Error resetting password: ${resetPasswordResult}`)
    return createRedirectResponse("/500")
  }

  if (resetPasswordResult) {
    return {
      props: {
        csrfToken,
        emailAddress,
        validationCode,
        passwordInsecure: true,
        passwordInsecureMessage: resetPasswordResult,
        resetStage: "newPassword",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  return {
    props: {
      csrfToken,
      resetStage: "success",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
      incorrectDelay: config.incorrectDelay
    }
  }
}

const handlePost = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[]
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext
  const { resetStage } = formData as { emailAddress: string; resetStage: string; validationCode: string }
  const connection = getConnection()

  if (resetStage === "email") {
    return handleEmailStage(context, serviceMessages, connection)
  }

  if (resetStage === "validateCode") {
    const resetPasswordOnSuccess = (
      _connection: Database,
      _context: GetServerSidePropsContext<ParsedUrlQuery>,
      _user: UserAuthBichard,
      emailAddress: string,
      validationCode: string
    ): Promise<GetServerSidePropsResult<Props>> => {
      return Promise.resolve({
        props: {
          csrfToken,
          emailAddress,
          validationCode,
          resetStage: "newPassword",
          serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
          incorrectDelay: config.incorrectDelay
        }
      })
    }

    return handleValidateCodeStage(context, serviceMessages, connection, {
      stageKey: "resetStage",
      onSuccess: resetPasswordOnSuccess
    })
  }

  if (resetStage === "newPassword") {
    return handleNewPasswordStage(context, serviceMessages, connection)
  }

  if (resetStage === "resetSecurityCode") {
    return handleResetSecurityCodeStage(context, serviceMessages, connection, "resetStage")
  }
  return createRedirectResponse("/500")
}

const handleGet = (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[]
): GetServerSidePropsResult<Props> => {
  const { csrfToken, query, req, res } = context as CsrfServerSidePropsContext
  const { email, notYou, action } = query as { email: string; notYou?: string; action?: string }

  if (action === "sendCodeAgain") {
    const inProgressEmailAddress = getEmailAddressFromCookie(req, config, "IN_PROGRESS")
    if (!inProgressEmailAddress) {
      return createRedirectResponse("/login/reset-password")
    }
    return {
      props: {
        csrfToken,
        emailAddress: inProgressEmailAddress,
        resetStage: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }

  if (notYou === "true") {
    removeEmailAddressCookie(res, config, "REMEMBER")
    removeEmailAddressCookie(res, config, "IN_PROGRESS")
  }

  if (email) {
    return {
      props: {
        csrfToken,
        emailAddress: email,
        resetStage: "validateCode",
        validationCode: "",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        incorrectDelay: config.incorrectDelay
      }
    }
  }
  return {
    props: {
      csrfToken,
      resetStage: "email",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
      incorrectDelay: config.incorrectDelay
    }
  }
}

export const getServerSideProps = withCsrf(
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req } = context as CsrfServerSidePropsContext

    const connection = getConnection()
    let serviceMessagesResult = await getServiceMessages(connection, 0)

    if (isError(serviceMessagesResult)) {
      logger.error(serviceMessagesResult)
      serviceMessagesResult = { result: [], totalElements: 0 }
    }

    if (isPost(req)) {
      return handlePost(context, serviceMessagesResult.result)
    }

    if (isGet(req)) {
      return handleGet(context, serviceMessagesResult.result)
    }

    return createRedirectResponse("/400")
  }
)

interface Props {
  emailError?: string
  sendingError?: boolean
  csrfToken: string
  resetStage?: string
  emailAddress?: string
  validationCode?: string
  invalidCodeError?: string
  passwordsMismatch?: boolean
  invalidPassword?: boolean
  passwordInsecure?: boolean
  passwordInsecureMessage?: string
  serviceMessages: ServiceMessage[]
  incorrectDelay: number
}

const ForgotPassword = ({
  emailError,
  sendingError,
  csrfToken,
  resetStage,
  emailAddress,
  validationCode,
  invalidCodeError,
  passwordsMismatch,
  invalidPassword,
  passwordInsecure,
  passwordInsecureMessage,
  serviceMessages
}: Props) => {
  const passwordMismatchError = "Passwords do not match. Enter passwords again."
  const newPasswordMissingError = "Enter a new password"
  const newPasswordError = (invalidPassword && newPasswordMissingError) || (passwordInsecure && passwordInsecureMessage)
  const errorSummaryTitle = "There is a problem"
  const textInputWidth = "30"

  return (
    <>
      <Head>
        <title>{"Reset password"}</title>
      </Head>
      <Layout>
        {resetStage === "success" ? (
          <GridRow>
            <GridColumn width="two-thirds">
              <BackLink href="/" />
              <h1 className="govuk-heading-xl">{"Password changed"}</h1>
              <Paragraph className="govuk-!-padding-bottom-4">
                {"You have successfully changed your password."}
              </Paragraph>
              <Link className="govuk-button" href="/">{`Return to sign in page`}</Link>
            </GridColumn>
          </GridRow>
        ) : (
          <GridRow>
            <GridColumn width="two-thirds">
              <BackLink href="/" />

              <ErrorSummary title={errorSummaryTitle} show={invalidPassword || passwordsMismatch || !!passwordInsecure}>
                <ErrorSummaryList
                  items={[
                    { id: "newPassword", error: invalidPassword && newPasswordMissingError },
                    {
                      id: "newPassword",
                      error: passwordsMismatch && passwordMismatchError
                    },
                    { id: "newPassword", error: passwordInsecureMessage }
                  ]}
                />
              </ErrorSummary>

              <ErrorSummary title="There is a problem" show={!!emailError}>
                <ErrorSummaryList items={[{ id: "email", error: emailError }]} />
              </ErrorSummary>

              <ErrorSummary title="There is a problem" show={!!invalidCodeError}>
                <ErrorSummaryList items={[{ id: "validationCode", error: invalidCodeError }]} />
              </ErrorSummary>

              <ErrorSummary title="There is a problem" show={!!sendingError}>
                <p>{"There is a resending the security code."}</p>
                <p>
                  {"Please try again or "}
                  <ContactLink>{"contact support"}</ContactLink>
                  {" to report this issue."}
                </p>
              </ErrorSummary>

              {resetStage === "email" && (
                <Form method="post" csrfToken={csrfToken}>
                  <h1 className="govuk-heading-xl">{"Confirm your email address"}</h1>
                  <Paragraph>{"We need to confirm your email address is registered to a Bichard7 account."}</Paragraph>
                  <Paragraph>
                    {
                      "If your email address is registered to a Bichard7 account you will receive a security code by email."
                    }
                  </Paragraph>
                  <Paragraph className="govuk-!-padding-bottom-4">
                    {
                      "If you don't know your email address, contact the member of your team responsible for managing Bichard7 accounts."
                    }
                  </Paragraph>
                  <TextInput
                    id="email"
                    name="emailAddress"
                    label="Email address"
                    labelSize="s"
                    hint="Enter the email address for your Bichard7 account"
                    type="email"
                    width={textInputWidth}
                    error={emailError}
                  />
                  <input type="hidden" name="resetStage" value="email" />
                  <Button noDoubleClick>{"Next"}</Button>
                </Form>
              )}

              {resetStage === "validateCode" && (
                <ValidateCodeForm
                  csrfToken={csrfToken}
                  emailAddress={emailAddress}
                  validationCode={validationCode}
                  invalidCodeError={invalidCodeError}
                  stageName="resetStage"
                  stageValue="validateCode"
                  sendAgainUrl="/login/reset-password"
                />
              )}

              {resetStage === "newPassword" && (
                <Form method="post" csrfToken={csrfToken}>
                  <h1 className="govuk-heading-xl">{"Create your new password"}</h1>
                  <Paragraph>{"Your password must have 8 characters or more."}</Paragraph>
                  <Paragraph>
                    {"You can choose to include numbers, symbols, uppercase and lowercase letters."}
                  </Paragraph>
                  <BulletList
                    heading="Do not include:"
                    items={[
                      "personal information such as your name, last name or email address",
                      "things people know about you such as pets names, favourite brands or sports teams",
                      "passwords that are commonly used or easily guessed. For example 12345678 or password"
                    ]}
                  ></BulletList>
                  <Paragraph>{"You can't use a password you have used before."}</Paragraph>
                  <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
                  <input id="validationCode" name="validationCode" type="hidden" value={validationCode} />
                  <input type="hidden" name="resetStage" value="newPassword" />
                  <ResetPasswordFormGroup
                    passwordMismatch={passwordsMismatch}
                    passwordsMismatchError={passwordMismatchError}
                    newPasswordError={newPasswordError}
                  />
                  <Button noDoubleClick>{"Save password"}</Button>
                </Form>
              )}

              {resetStage === "resetSecurityCode" && (
                <ResendSecurityCodeForm
                  csrfToken={csrfToken}
                  emailAddress={emailAddress}
                  stageName="resetStage"
                  stageValue="resetSecurityCode"
                />
              )}
            </GridColumn>
            <GridColumn width="one-third">
              <ServiceMessages messages={serviceMessages} />
            </GridColumn>
          </GridRow>
        )}
      </Layout>
    </>
  )
}

export default ForgotPassword
