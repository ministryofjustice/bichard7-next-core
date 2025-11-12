import Button from "components/Button"
import ContactLink from "components/ContactLink"
import { ErrorSummaryList } from "components/ErrorSummary"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import Form from "components/Form"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import Paragraph from "components/Paragraph"
import ServiceMessages from "components/ServiceMessages"
import { removeCjsmSuffix } from "lib/cjsmSuffix"
import config from "lib/config"
import getAuditLogger from "lib/getAuditLogger"
import getConnection from "lib/getConnection"
import getRedirectPath from "lib/getRedirectPath"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Database from "types/Database"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"
import UserAuthBichard from "types/UserAuthBichard"
import {
  authenticate,
  getEmailAddressFromCookie,
  removeEmailAddressCookie,
  signInUser,
  storeEmailAddressInCookie
} from "useCases"
import getFailedPasswordAttempts from "useCases/getFailedPasswordAttempts"
import getServiceMessages from "useCases/getServiceMessages"
import sendVerificationCodeEmail from "useCases/sendVerificationCodeEmail"
import addQueryParams from "utils/addQueryParams"
import createRedirectResponse from "utils/createRedirectResponse"
import { isGet, isPost } from "utils/http"
import logger from "utils/logger"
import LoginCredentialsFormGroup from "components/Login/LoginCredentialsFormGroup"
import Details from "components/Details"
import React from "react"
import PasswordInput from "components/Login/PasswordInput"
import ValidateCodeForm from "components/Login/ValidateCodeForm"
import ResendSecurityCodeForm from "components/Login/ResendSecurityCodeForm"
import { handleValidateCodeStage } from "lib/handleValidateCodeStage"
import { handleResetSecurityCodeStage } from "lib/handleResetSecurityCodeStage"
import { RememberForm } from "components/Login/RememberForm"

const authenticationErrorMessage = "Error authenticating the request"

const getNotYourEmailLink = (query: ParsedUrlQuery): string => {
  let redirectParams: { [key: string]: string } = {}
  const redirectPath = getRedirectPath(query)

  if (redirectPath) {
    redirectParams = { redirectPath }
  }

  return addQueryParams("/login", {
    notYou: "true",
    ...redirectParams
  })
}

const handleInitialLoginStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken, httpsRedirectCookie } = context as CsrfServerSidePropsContext &
    AuthenticationServerSidePropsContext
  const { emailAddress, password } = formData as { emailAddress: string; password: string }

  const emailIsValid = !!emailAddress.match(/\S+@\S+\.\S+/)
  const hasEmail = !!emailAddress
  const hasPassword = !!password

  let emailError: string | undefined
  let passwordError: string | undefined

  if (!hasEmail) {
    emailError = "Enter your email address"
  } else if (!emailIsValid) {
    emailError = "Enter an email address in the correct format, for example name@example.com"
  }

  if (!hasPassword) {
    passwordError = "Enter a password"
  }

  if (emailError || passwordError) {
    const errorProps = {
      csrfToken,
      emailAddress,
      loginStage: "initialLogin",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
    }

    return {
      props: {
        ...errorProps,
        ...(emailError && { emailError }),
        ...(passwordError && { passwordError })
      }
    }
  }
  const normalisedEmail = removeCjsmSuffix(emailAddress)
  const auditLogger = getAuditLogger(context, config)

  const user = await authenticate(connection, auditLogger, normalisedEmail, password, null)

  if (isError(user)) {
    logger.error(`Error logging in user [${normalisedEmail}]: ${user.message}`)
    const attemptsSoFar = await getFailedPasswordAttempts(connection, normalisedEmail)
    if (!isError(attemptsSoFar) && attemptsSoFar >= config.maxPasswordFailedAttempts) {
      return {
        props: {
          emailAddress: normalisedEmail,
          csrfToken,
          tooManyPasswordAttempts: true,
          loginStage: "initialLogin",
          serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
        }
      }
    }
    return {
      props: {
        invalidCredentials: true,
        invalidCredentialsError: "Incorrect email address or password",
        emailAddress: normalisedEmail,
        csrfToken,
        loginStage: "initialLogin",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }
  const sent = await sendVerificationCodeEmail(connection, normalisedEmail, "loginStage")

  if (isError(sent)) {
    logger.error(sent)
    return {
      props: {
        csrfToken,
        emailAddress: normalisedEmail,
        sendingError: true,
        loginStage: "initialLogin",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  const { res } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  storeEmailAddressInCookie(res, config, normalisedEmail, "IN_PROGRESS")

  return {
    props: {
      csrfToken,
      emailAddress: normalisedEmail,
      loginStage: "validateCode",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
      httpsRedirectCookie
    }
  }
}

const logInUser = async (
  connection: Database,
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  user: UserAuthBichard
): Promise<GetServerSidePropsResult<Props>> => {
  const { res, req, formData, query } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext

  removeEmailAddressCookie(res, config, "IN_PROGRESS")

  const { rememberEmailAddress } = formData as {
    rememberEmailAddress: string
  }

  const authToken = await signInUser(connection, res, user)
  if (isError(authToken)) {
    logger.error(authToken)
    throw new Error(authenticationErrorMessage)
  }

  if (rememberEmailAddress) {
    const emailAddressFromCookie = getEmailAddressFromCookie(req, config, "REMEMBER")

    if (!emailAddressFromCookie || emailAddressFromCookie !== user.emailAddress) {
      storeEmailAddressInCookie(res, config, user.emailAddress, "REMEMBER")
    }
  } else {
    removeEmailAddressCookie(res, config, "REMEMBER")
  }

  const redirectPath = getRedirectPath(query)
  if (redirectPath) {
    return createRedirectResponse(redirectPath, { basePath: false })
  }

  return createRedirectResponse("/")
}

const handleRememberedEmailStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { req, formData, csrfToken, query } = context as CsrfServerSidePropsContext &
    AuthenticationServerSidePropsContext
  const { password } = formData as {
    emailAddress: string
    password: string
    rememberEmailAddress: string
  }

  const emailAddress = getEmailAddressFromCookie(req, config, "REMEMBER")
  if (!emailAddress) {
    return createRedirectResponse("/users/login")
  }

  const auditLogger = getAuditLogger(context, config)
  const user = await authenticate(connection, auditLogger, emailAddress, password, null)

  if (isError(user)) {
    logger.error(`Error logging in: ${user.message}`)
    const attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    const notYourEmailAddressUrl = getNotYourEmailLink(query)
    if (!isError(attemptsSoFar) && attemptsSoFar >= config.maxPasswordFailedAttempts) {
      return {
        props: {
          csrfToken,
          emailAddress,
          loginStage: "rememberedEmail",
          notYourEmailAddressUrl,
          tooManyPasswordAttempts: true,
          serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
        }
      }
    }
    return {
      props: {
        invalidCredentials: true,
        invalidCredentialsError: "Incorrect email address or password",
        csrfToken,
        emailAddress,
        notYourEmailAddressUrl,
        loginStage: "rememberedEmail",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return logInUser(connection, context, user)
}

const handlePost = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[]
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { loginStage } = formData
  const connection = getConnection()

  if (loginStage === "initialLogin") {
    return handleInitialLoginStage(context, serviceMessages, connection)
  }

  if (loginStage === "validateCode") {
    const loginOnSuccess = (
      connection: Database,
      context: GetServerSidePropsContext<ParsedUrlQuery>,
      user: UserAuthBichard
    ): Promise<GetServerSidePropsResult<Props>> => {
      return logInUser(connection, context, user)
    }

    return handleValidateCodeStage(context, serviceMessages, connection, {
      stageKey: "loginStage",
      onSuccess: loginOnSuccess
    })
  }

  if (loginStage === "rememberedEmail") {
    return handleRememberedEmailStage(context, serviceMessages, connection)
  }

  if (loginStage === "resetSecurityCode") {
    return handleResetSecurityCodeStage(context, serviceMessages, connection, "loginStage")
  }

  return createRedirectResponse("/500")
}

const handleGet = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[]
): Promise<GetServerSidePropsResult<Props>> => {
  const { csrfToken, query, req, res, httpsRedirectCookie } = context as CsrfServerSidePropsContext &
    AuthenticationServerSidePropsContext
  const { notYou, action } = query as { notYou: string; action?: string }

  if (action === "sendCodeAgain") {
    const inProgressEmailAddress = getEmailAddressFromCookie(req, config, "IN_PROGRESS")
    if (!inProgressEmailAddress) {
      return createRedirectResponse("/login")
    }
    return {
      props: {
        csrfToken,
        emailAddress: inProgressEmailAddress,
        loginStage: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        httpsRedirectCookie
      }
    }
  }

  let emailAddress = getEmailAddressFromCookie(req, config, "REMEMBER")

  if (notYou === "true") {
    removeEmailAddressCookie(res, config, "REMEMBER")
    removeEmailAddressCookie(res, config, "IN_PROGRESS")

    emailAddress = null
  }

  if (emailAddress) {
    const notYourEmailAddressUrl = getNotYourEmailLink(query)

    return {
      props: {
        csrfToken,
        emailAddress,
        notYourEmailAddressUrl,
        loginStage: "rememberedEmail",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
        httpsRedirectCookie
      }
    }
  }

  return {
    props: {
      csrfToken,
      loginStage: "initialLogin",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages)),
      httpsRedirectCookie
    }
  }
}

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, currentUser } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext

    if (currentUser) {
      return createRedirectResponse("/")
    }

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
      return await handleGet(context, serviceMessagesResult.result)
    }

    return createRedirectResponse("/400")
  }
)

interface Props {
  emailAddress?: string
  emailError?: string
  passwordError?: string
  csrfToken: string
  sendingError?: boolean
  loginStage?: string
  invalidCredentials?: boolean
  invalidCredentialsError?: string
  validationCode?: string
  invalidCodeError?: string
  tooManyPasswordAttempts?: boolean
  notYourEmailAddressUrl?: string
  serviceMessages: ServiceMessage[]
  httpsRedirectCookie?: boolean
}

const Index = ({
  emailAddress,
  emailError,
  passwordError,
  csrfToken,
  sendingError,
  loginStage,
  validationCode,
  invalidCredentials,
  invalidCredentialsError,
  invalidCodeError,
  tooManyPasswordAttempts,
  notYourEmailAddressUrl,
  serviceMessages,
  httpsRedirectCookie
}: Props) => {
  const upgradeToHttps =
    typeof window !== "undefined" &&
    !window.location.protocol.includes("https") &&
    (window.location.host === "bichard7.service.justice.gov.uk" ||
      window.location.host === "psnportal.bichard7.pnn.police.uk") &&
    httpsRedirectCookie

  const validationErrors: { id: string; error: string }[] = []
  if (emailError) {
    validationErrors.push({ id: "email", error: emailError })
  }
  if (passwordError) {
    validationErrors.push({ id: "password", error: passwordError })
  }
  if (invalidCodeError) {
    validationErrors.push({ id: "password", error: invalidCodeError })
  }
  const showValidationErrors = validationErrors.length > 0

  return (
    <>
      <Head>
        <title>{"Sign in to Bichard7"}</title>
      </Head>
      <Layout>
        <GridRow>
          <GridColumn width="two-thirds">
            <ErrorSummary title="There is a problem" show={!!sendingError}>
              <p>
                {"There is a problem signing in "}
                <b>{emailAddress}</b>
                {"."}
              </p>
              <p>
                {"Please try again or "}
                <ContactLink>{"contact support"}</ContactLink>
                {" to report this issue."}
              </p>
            </ErrorSummary>

            <ErrorSummary title="There is a problem" show={showValidationErrors}>
              <ErrorSummaryList items={validationErrors} />
            </ErrorSummary>

            <ErrorSummary title="There is a problem" show={!!tooManyPasswordAttempts}>
              <p>{"Too many incorrect password attempts. Please try signing in again."}</p>
            </ErrorSummary>

            {invalidCredentials && (
              <ErrorSummary title="There is a problem" show={invalidCredentials}>
                <ErrorSummaryList
                  items={[
                    { id: "password", error: "Incorrect email address or password" },
                    {
                      error: (
                        <>
                          {"Please wait "}
                          <b>
                            {config.incorrectDelay}
                            {" seconds"}
                          </b>
                          {" before trying again."}
                        </>
                      )
                    }
                  ]}
                />
              </ErrorSummary>
            )}

            {loginStage === "initialLogin" && (
              <>
                <h1 className="govuk-heading-xl govuk-!-margin-bottom-7">{"Sign in to Bichard7"}</h1>
                <Form method="post" csrfToken={csrfToken}>
                  <Paragraph>
                    {"To sign in you need the email address and password for your Bichard7 account."}
                  </Paragraph>
                  <Paragraph className="govuk-!-padding-bottom-2">
                    {
                      "If your email address is registered to a Bichard7 account you will receive a security code by email."
                    }
                  </Paragraph>
                  <input type="hidden" name="loginStage" value="initialLogin" />
                  <LoginCredentialsFormGroup
                    invalidCredentialsError={invalidCredentialsError}
                    emailError={emailError}
                    emailAddress={emailAddress}
                    passwordError={passwordError}
                  />
                  <Button>{"Sign in"}</Button>
                  <Details summary={"Help signing in"} data-test="helpSigningIn">
                    <>
                      <Paragraph>
                        {
                          "If you don't know your email address, contact the member of your team responsible for managing Bichard7 accounts."
                        }
                      </Paragraph>
                      <Paragraph>
                        {"You can "}
                        <Link href="/login/reset-password" data-test="reset-password">
                          {"change your password"}
                        </Link>
                        {" if you have forgotten it."}
                      </Paragraph>
                    </>
                  </Details>
                </Form>
              </>
            )}

            {loginStage === "validateCode" && (
              <ValidateCodeForm
                csrfToken={csrfToken}
                emailAddress={emailAddress}
                validationCode={validationCode}
                invalidCodeError={invalidCodeError}
                stageName="loginStage"
                stageValue="validateCode"
                sendAgainUrl="/login"
                showRememberForm
              />
            )}

            {loginStage === "rememberedEmail" && (
              <>
                <h1 className="govuk-heading-xl govuk-!-margin-bottom-7">{"Sign in to Bichard 7"}</h1>
                <Form method="post" csrfToken={csrfToken}>
                  <Paragraph>
                    {"You are signing in as "}
                    <b>{emailAddress}</b>
                    {"."}
                  </Paragraph>
                  {notYourEmailAddressUrl && (
                    <Paragraph>
                      {"If this is not your account, you can "}
                      <Link href={notYourEmailAddressUrl} data-test="not-you-link">
                        {"sign in with a different email address"}
                      </Link>
                      {"."}
                    </Paragraph>
                  )}
                  <input type="hidden" name="loginStage" value="rememberedEmail" />
                  <PasswordInput name="password" label="Password" labelSize="s" hint="Enter your password" width="30" />
                  <RememberForm checked />
                  <Button>{"Sign in"}</Button>
                </Form>
              </>
            )}
            {loginStage === "resetSecurityCode" && (
              <ResendSecurityCodeForm
                csrfToken={csrfToken}
                emailAddress={emailAddress}
                stageName="loginStage"
                stageValue="resetSecurityCode"
              />
            )}
          </GridColumn>
          <GridColumn width="one-third">
            <ServiceMessages messages={serviceMessages} />
          </GridColumn>
        </GridRow>
      </Layout>
      {upgradeToHttps && (
        <script type="text/javascript">{(window.location.href = "https://bichard7.service.justice.gov.uk")}</script>
      )}
    </>
  )
}

export default Index
