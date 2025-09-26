import Button from "components/Button"
import ContactLink from "components/ContactLink"
import { ErrorSummaryList } from "components/ErrorSummary"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import Form from "components/Form"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import NotReceivedEmail from "components/NotReceivedEmail"
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

const authenticationErrorMessage = "Error authenticating the reqest"

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

const handleEmailStage = async (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[],
  connection: Database
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData, csrfToken, httpsRedirectCookie } = context as CsrfServerSidePropsContext &
    AuthenticationServerSidePropsContext
  const { emailAddress } = formData as { emailAddress: string }

  if (!emailAddress.match(/\S+@\S+\.\S+/)) {
    return {
      props: {
        csrfToken,
        emailAddress,
        emailError: "Enter a valid email address",
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

  const normalisedEmail = removeCjsmSuffix(emailAddress)
  const sent = await sendVerificationCodeEmail(connection, normalisedEmail, "login")

  if (isError(sent)) {
    logger.error(sent)
    return {
      props: {
        csrfToken,
        emailAddress: normalisedEmail,
        sendingError: true,
        serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
      }
    }
  }

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
  const { emailAddress, validationCode, password } = formData as {
    emailAddress: string
    validationCode: string
    password: string
  }

  const auditLogger = getAuditLogger(context, config)
  const user = await authenticate(connection, auditLogger, emailAddress, password, validationCode)

  if (isError(user)) {
    logger.error(`Error logging in user [${emailAddress}]: ${user.message}`)
    const attemptsSoFar = await getFailedPasswordAttempts(connection, emailAddress)
    if (!isError(attemptsSoFar) && attemptsSoFar >= config.maxPasswordFailedAttempts) {
      return {
        props: {
          emailAddress,
          csrfToken,
          loginStage: "email",
          tooManyPasswordAttempts: true,
          serviceMessages: JSON.parse(JSON.stringify(serviceMessages))
        }
      }
    }
    return {
      props: {
        invalidCredentials: true,
        emailAddress,
        csrfToken,
        loginStage: "validateCode",
        validationCode,
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

const handlePost = (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[]
): Promise<GetServerSidePropsResult<Props>> => {
  const { formData } = context as CsrfServerSidePropsContext & AuthenticationServerSidePropsContext
  const { loginStage } = formData
  const connection = getConnection()

  if (loginStage === "email") {
    return handleEmailStage(context, serviceMessages, connection)
  }

  if (loginStage === "validateCode") {
    return handleValidateCodeStage(context, serviceMessages, connection)
  }

  if (loginStage === "rememberedEmail") {
    return handleRememberedEmailStage(context, serviceMessages, connection)
  }

  return Promise.resolve(createRedirectResponse("/500"))
}

const handleGet = (
  context: GetServerSidePropsContext<ParsedUrlQuery>,
  serviceMessages: ServiceMessage[]
): GetServerSidePropsResult<Props> => {
  const { csrfToken, query, req, res, httpsRedirectCookie } = context as CsrfServerSidePropsContext &
    AuthenticationServerSidePropsContext
  const { notYou } = query as { notYou: string }

  if (notYou === "true") {
    removeEmailAddressCookie(res, config)
  } else {
    const emailAddress = getEmailAddressFromCookie(req, config)

    const notYourEmailAddressUrl = getNotYourEmailLink(query)

    if (emailAddress) {
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
  }

  return {
    props: {
      csrfToken,
      loginStage: "email",
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
      return Promise.resolve(createRedirectResponse("/"))
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
      return Promise.resolve(handleGet(context, serviceMessagesResult.result))
    }

    return Promise.resolve(createRedirectResponse("/400"))
  }
)

interface Props {
  emailAddress?: string
  emailError?: string
  csrfToken: string
  sendingError?: boolean
  loginStage?: string
  invalidCredentials?: boolean
  validationCode?: string
  tooManyPasswordAttempts?: boolean
  notYourEmailAddressUrl?: string
  serviceMessages: ServiceMessage[]
  httpsRedirectCookie?: boolean
}

type RememberProps = {
  checked: boolean
}
const RememberForm = ({ checked }: RememberProps) => (
  <div className="govuk-form-group">
    <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
      <legend className="govuk-fieldset__legend">{"Do you want your email address to be remembered?"}</legend>
      <div className="govuk-hint">
        {
          "You will not be asked to verify your email address for 24 hours when signing in on this device. Do not choose 'Yes' if you do not trust this device."
        }
      </div>
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
            {"Yes, remember my email address."}
          </label>
        </div>
      </div>
    </fieldset>
  </div>
)

const Index = ({
  emailAddress,
  emailError,
  csrfToken,
  sendingError,
  loginStage,
  validationCode,
  invalidCredentials,
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

  return (
    <>
      <Head>
        <title>{"Sign in to Bichard 7"}</title>
      </Head>
      <Layout>
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="govuk-heading-xl">{"Sign in to Bichard 7"}</h1>

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

            <ErrorSummary title="There is a problem" show={!!emailError}>
              <ErrorSummaryList items={[{ id: "email", error: emailError }]} />
            </ErrorSummary>

            <ErrorSummary title="There is a problem" show={!!tooManyPasswordAttempts}>
              <p>{"Too many incorrect password attempts. Please try signing in again."}</p>
            </ErrorSummary>

            {invalidCredentials && (
              <ErrorSummary title="Your details do not match" show={invalidCredentials}>
                <ErrorSummaryList
                  items={[
                    { id: "password", error: "Enter a valid code and password combination." },
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

            {loginStage === "email" && (
              <Form method="post" csrfToken={csrfToken}>
                <input type="hidden" name="loginStage" value="email" />
                <TextInput
                  id="email"
                  name="emailAddress"
                  label="Email address"
                  type="email"
                  error={emailError}
                  value={emailAddress}
                />
                <Button>{"Sign in"}</Button>
              </Form>
            )}

            {loginStage === "validateCode" && (
              <Form method="post" csrfToken={csrfToken}>
                <Paragraph>{"If an account was found we will have sent you an email."}</Paragraph>
                <NotReceivedEmail sendAgainUrl="/login" />
                <input id="email" name="emailAddress" type="hidden" value={emailAddress} />
                <input type="hidden" name="loginStage" value="validateCode" />
                <TextInput
                  id="validationCode"
                  name="validationCode"
                  label="Enter the 6 character code from the email"
                  type="text"
                  value={validationCode}
                  optionalProps={{ autocomplete: "off", "aria-autocomplete": "none" }}
                />
                <TextInput name="password" label="Password" type="password" />
                <RememberForm checked={false} />
                <Button>{"Sign in"}</Button>
              </Form>
            )}

            {loginStage === "rememberedEmail" && (
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
            )}
            <Paragraph>
              <Link href="/login/reset-password" data-test="reset-password">
                {"I have forgotten my password"}
              </Link>
            </Paragraph>
            <Paragraph>
              {"If you need help with anything else, you can "}
              <ContactLink>{"contact support"}</ContactLink>
              {"."}
            </Paragraph>
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
