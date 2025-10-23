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
import TextInput from "components/TextInput"
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
import validateUserVerificationCode from "useCases/validateUserVerificationCode"
import NotReceivedEmail from "components/NotReceivedEmail"
import LoginCredentialsFormGroup from "components/Login/LoginCredentialsFormGroup"
import Details from "components/Details"
import resetUserVerificationCode from "useCases/resetUserVerificationCode"
import storeInProgressEmailAddressInCookie from "useCases/storeInProgressEmailAddressInCookie"
import getInProgressEmailAddressFromCookie from "useCases/getInProgressEmailAddressFromCookie"
import removeInProgressEmailAddressCookie from "useCases/removeInProgressEmailAddressCookie"

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
  const sent = await sendVerificationCodeEmail(connection, normalisedEmail, "login")

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
  storeInProgressEmailAddressInCookie(res, config, normalisedEmail)

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

  removeInProgressEmailAddressCookie(res, config)

  const { rememberEmailAddress } = formData as {
    rememberEmailAddress: string
  }

  const authToken = await signInUser(connection, res, user)
  if (isError(authToken)) {
    logger.error(authToken)
    throw new Error(authenticationErrorMessage)
  }

  if (rememberEmailAddress) {
    const emailAddressFromCookie = getEmailAddressFromCookie(req, config)

    if (!emailAddressFromCookie || emailAddressFromCookie !== user.emailAddress) {
      storeEmailAddressInCookie(res, config, user.emailAddress)
    }
  } else {
    removeEmailAddressCookie(res, config)
  }

  const redirectPath = getRedirectPath(query)
  if (redirectPath) {
    return createRedirectResponse(redirectPath, { basePath: false })
  }

  return createRedirectResponse("/")
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

  if (!validationCode) {
    return {
      props: {
        invalidCodeError: "Enter a security code",
        emailAddress,
        csrfToken,
        loginStage: "validateCode",
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
        loginStage: "validateCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return logInUser(connection, context, user)
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

  const emailAddress = getEmailAddressFromCookie(req, config)
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
        loginStage: "resetSecurityCode",
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
        loginStage: "resetSecurityCode",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  return {
    props: {
      csrfToken,
      emailAddress,
      loginStage: "validateCode",
      serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
    }
  }
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
    return handleValidateCodeStage(context, serviceMessages, connection)
  }

  if (loginStage === "rememberedEmail") {
    return handleRememberedEmailStage(context, serviceMessages, connection)
  }

  if (loginStage === "resetSecurityCode") {
    return handleResetSecurityCodeStage(context, serviceMessages, connection)
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
    const inProgressEmailAddress = getInProgressEmailAddressFromCookie(req, config)
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

  let emailAddress = getEmailAddressFromCookie(req, config) // Get current email

  if (notYou === "true") {
    removeEmailAddressCookie(res, config)
    removeInProgressEmailAddressCookie(res, config)

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

type RememberProps = {
  checked: boolean
}
const RememberForm = ({ checked }: RememberProps) => (
  <div className="govuk-form-group govuk-!-padding-top-4">
    <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Sign in without a code next time"}</legend>
      <div className="govuk-checkboxes" data-module="govuk-checkboxes">
        <div className="govuk-checkboxes__item">
          <input
            className="govuk-checkboxes__input"
            id="rememberEmailYes"
            name="rememberEmailAddress"
            type="checkbox"
            value="yes"
            defaultChecked={checked}
          />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="rememberEmailYes">
            {"I trust this device. I don't want to sign in with a code again today."}
          </label>
        </div>
        <div className="govuk-warning-text govuk-!-margin-bottom-0">
          <span className="govuk-warning-text__icon" aria-hidden="true">
            {"!"}
          </span>
          <strong className="govuk-warning-text__text">
            <span className="govuk-visually-hidden">{"Warning"}</span>
            {"Don't use this option if you are using a public or shared device."}
          </strong>
        </div>
      </div>
    </fieldset>
  </div>
)

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
        <title>{"Sign in to Bichard 7"}</title>
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
                <h1 className="govuk-heading-xl govuk-!-margin-bottom-7">{"Sign in to Bichard 7"}</h1>
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
              <>
                <h1 className="govuk-heading-xl govuk-!-margin-bottom-7">{"Check your email"}</h1>
                <Form method="post" csrfToken={csrfToken}>
                  <Paragraph>
                    {`We have sent an email to: `}
                    <b>{emailAddress}</b>
                  </Paragraph>
                  <Paragraph>{`The email contains your security code.`}</Paragraph>
                  <Paragraph>{`Your email can take up to 5 minutes to arrive. Check your spam folder if you don't get an email.`}</Paragraph>
                  <Paragraph className="govuk-!-padding-bottom-4">{`The code will expire after 30 minutes.`}</Paragraph>
                  <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
                  <input type="hidden" name="loginStage" value="validateCode" />
                  <TextInput
                    id="validationCode"
                    name="validationCode"
                    label="Security code"
                    labelSize="s"
                    hint="Enter the security code"
                    type="text"
                    value={validationCode}
                    error={invalidCodeError}
                    optionalProps={{ autocomplete: "off", "aria-autocomplete": "none" }}
                  />
                  <RememberForm checked={false} />
                  <Button>{"Sign in"}</Button>
                  <NotReceivedEmail sendAgainUrl="/login" />
                </Form>
              </>
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
                  <TextInput name="password" label="Password" type="password" />
                  <RememberForm checked />
                  <Button>{"Sign in"}</Button>
                </Form>
              </>
            )}

            {loginStage === "resetSecurityCode" && (
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
                  <input type="hidden" name="loginStage" value="resetSecurityCode" />
                  <Button id="security-code-button">{"Get security code"}</Button>
                </Form>
              </>
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
