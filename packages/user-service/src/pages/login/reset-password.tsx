import Button from "components/Button"
import Layout from "components/Layout"
import Head from "next/head"
import TextInput from "components/TextInput"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import BackLink from "components/BackLink"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import getConnection from "lib/getConnection"
import { isError } from "types/Result"
import createRedirectResponse from "utils/createRedirectResponse"
import Form from "components/Form"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { withCsrf } from "middleware"
import { isGet, isPost } from "utils/http"
import { ParsedUrlQuery } from "querystring"
import { ErrorSummaryList } from "components/ErrorSummary"
import config from "lib/config"
import { removeCjsmSuffix } from "lib/cjsmSuffix"
import sendVerificationCodeEmail from "useCases/sendVerificationCodeEmail"
import Database from "types/Database"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import Link from "components/Link"
import getAuditLogger from "lib/getAuditLogger"
import logger from "utils/logger"
import passwordSecurityCheck from "useCases/passwordSecurityCheck"
import resetPassword, { ResetPasswordOptions } from "useCases/resetPassword"
import SuccessBanner from "components/SuccessBanner"
import NotReceivedEmail from "components/NotReceivedEmail"
import ServiceMessages from "components/ServiceMessages"
import ServiceMessage from "types/ServiceMessage"
import getServiceMessages from "useCases/getServiceMessages"
import Paragraph from "components/Paragraph"
import GridColumn from "components/GridColumn"
import React from "react"
import GridRow from "components/GridRow"
import BulletList from "components/BulletList"
import validateUserVerificationCode from "useCases/validateUserVerificationCode"
import resetUserVerificationCode from "useCases/resetUserVerificationCode"
import ContactLink from "components/ContactLink"
import { removeEmailAddressCookie } from "useCases"
import getInProgressEmailAddressFromCookie from "useCases/getInProgressEmailAddressFromCookie"
import storeInProgressEmailAddressInCookie from "useCases/storeInProgressEmailAddressInCookie"
import removeInProgressEmailAddressCookie from "useCases/removeInProgressEmailAddressCookie"
import ResetPasswordFormGroup from "components/Login/ResetPasswordFormGroup"

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
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  const normalisedEmail = removeCjsmSuffix(emailAddress)
  const sent = await sendVerificationCodeEmail(connection, normalisedEmail, "passwordReset")

  if (isError(sent)) {
    logger.error(sent)
    return {
      props: {
        csrfToken,
        emailAddress: normalisedEmail,
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  const { res } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  storeInProgressEmailAddressInCookie(res, config, normalisedEmail)

  return {
    props: {
      csrfToken,
      emailAddress: normalisedEmail,
      resetStage: "validateCode",
      validationCode: "",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
    }
  }
}

const handleValidateCodeStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { emailAddress, validationCode } = formData as {
    emailAddress: string
    validationCode: string
  }

  let validationCodeError: string | undefined
  if (!validationCode) {
    validationCodeError = "Enter your security code"
  }

  if (validationCodeError) {
    return {
      props: {
        emailAddress,
        validationCode,
        validationCodeError,
        csrfToken,
        resetStage: "validateCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  const user = await validateUserVerificationCode(connection, emailAddress, validationCode)

  if (isError(user)) {
    logger.error(`Error validating code for user [${emailAddress}]: ${user.message}`)
    return {
      props: {
        emailAddress,
        validationCode,
        validationCodeError: "Incorrect security code",
        csrfToken,
        resetStage: "validateCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return {
    props: {
      csrfToken,
      emailAddress,
      validationCode,
      resetStage: "newPassword",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
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
        ...(passwordInsecure && { passwordInsecure: true, passwordInsecureMessage })
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
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return {
    props: {
      csrfToken,
      resetStage: "success",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
    }
  }
}

const handleResetSecurityCodeStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database
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
        resetStage: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  const sent = await sendVerificationCodeEmail(connection, emailAddress, "login")

  if (isError(sent)) {
    logger.error(sent)
    return {
      props: {
        csrfToken,
        emailAddress,
        sendingError: true,
        resetStage: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return {
    props: {
      csrfToken,
      emailAddress,
      resetStage: "validateCode",
      validationCode: "",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
    }
  }
}

const handlePost = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[]
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData } = context as CsrfServerSidePropsContext
  const { resetStage } = formData as { emailAddress: string; resetStage: string; validationCode: string }
  const connection = getConnection()

  if (resetStage === "email") {
    return handleEmailStage(context, serviceMessages, connection)
  }

  if (resetStage === "validateCode") {
    return handleValidateCodeStage(context, serviceMessages, connection)
  }

  if (resetStage === "newPassword") {
    return handleNewPasswordStage(context, serviceMessages, connection)
  }

  if (resetStage === "resetSecurityCode") {
    return handleResetSecurityCodeStage(context, serviceMessages, connection)
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
    const inProgressEmailAddress = getInProgressEmailAddressFromCookie(req, config)
    if (!inProgressEmailAddress) {
      return createRedirectResponse("/login/reset-password")
    }
    return {
      props: {
        csrfToken,
        emailAddress: inProgressEmailAddress,
        resetStage: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  if (notYou === "true") {
    removeEmailAddressCookie(res, config)
    removeInProgressEmailAddressCookie(res, config)
  }

  if (email) {
    return {
      props: {
        csrfToken,
        emailAddress: email,
        resetStage: "validateCode",
        validationCode: "",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }
  return {
    props: {
      csrfToken,
      resetStage: "email",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
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
  validationCodeError?: string
  passwordsMismatch?: boolean
  invalidPassword?: boolean
  passwordInsecure?: boolean
  passwordInsecureMessage?: string
  serviceMessages: ServiceMessage[]
}

const ForgotPassword = ({
  emailError,
  sendingError,
  csrfToken,
  resetStage,
  emailAddress,
  validationCode,
  validationCodeError,
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

              <SuccessBanner>
                {`You can now `}
                <Link href="/">{`sign in with your new password`}</Link>
                {`.`}
              </SuccessBanner>
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

              <ErrorSummary title="There is a problem" show={!!validationCodeError}>
                <ErrorSummaryList items={[{ id: "validationCode", error: validationCodeError }]} />
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
                <Form method="post" csrfToken={csrfToken}>
                  <h1 className="govuk-heading-xl">{"Check your email"}</h1>
                  <Paragraph>
                    {"We have sent a code to:"} <b>{emailAddress}</b>
                  </Paragraph>
                  <Paragraph>{`Your code can take up to 5 minutes to arrive. Check your spam folder if you don't get an email.`}</Paragraph>
                  <Paragraph className="govuk-!-padding-bottom-4">{`The code will expire after 30 minutes`}</Paragraph>
                  <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
                  <input type="hidden" name="resetStage" value="validateCode" />
                  <TextInput
                    id="validationCode"
                    name="validationCode"
                    label="Security Code"
                    labelSize="s"
                    hint="Enter the security code"
                    type="text"
                    width={textInputWidth}
                    value={validationCode}
                    error={validationCodeError}
                  />
                  <NotReceivedEmail sendAgainUrl="/login/reset-password" />
                  <Button noDoubleClick>{"Next"}</Button>
                </Form>
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
                <>
                  <h1 className="govuk-heading-xl govuk-!-margin-bottom-7">{"Get a security code"}</h1>
                  <Form method="post" csrfToken={csrfToken}>
                    <Paragraph>
                      {"We will send a code to: "}
                      <b>{emailAddress}</b>
                    </Paragraph>
                    <Paragraph>
                      {`Your code can take up to 5 minutes to arrive. Check your spam folder if you don't get an email.`}
                    </Paragraph>
                    <Paragraph className="govuk-!-padding-bottom-4">{`The code will expire after 30 minutes.`}</Paragraph>
                    <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
                    <input type="hidden" name="resetStage" value="resetSecurityCode" />
                    <Button id="security-code-button">{"Get security code"}</Button>
                  </Form>
                </>
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
