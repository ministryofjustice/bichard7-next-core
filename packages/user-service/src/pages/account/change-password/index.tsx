import Button from "components/Button"
import { ErrorSummary, ErrorSummaryList } from "components/ErrorSummary"
import Form from "components/Form"
import Layout from "components/Layout"
import SuggestPassword from "components/SuggestPassword"
import TextInput from "components/TextInput"
import config from "lib/config"
import getAuditLogger from "lib/getAuditLogger"
import getConnection from "lib/getConnection"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { isError } from "types/Result"
import User from "types/User"
import { changePassword, signOutUser } from "useCases"
import checkPassword from "useCases/checkPassword"
import generateRandomPassword from "useCases/generateRandomPassword"
import createRedirectResponse from "utils/createRedirectResponse"
import { isPost } from "utils/http"
import logger from "utils/logger"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { res, req, query, csrfToken, formData, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext

    if (!currentUser || !currentUser.emailAddress) {
      return createRedirectResponse("/login")
    }

    let suggestedPassword = ""
    const { suggestPassword } = query as { suggestPassword: string }

    const { pathname: urlPathname } = new URL(req.url as string, "http://localhost")
    const suggestedPasswordUrl = `${urlPathname}?suggestPassword=true`

    if (isPost(req)) {
      const { currentPassword, newPassword, confirmPassword } = formData as {
        currentPassword: string
        newPassword: string
        confirmPassword: string
      }

      if (!currentPassword || !newPassword || !confirmPassword) {
        return {
          props: { currentPasswordMissing: !currentPassword, newPasswordMissing: !newPassword, csrfToken, currentUser }
        }
      }

      const connection = getConnection()
      if (!(await checkPassword(connection, currentUser.emailAddress, currentPassword))) {
        return {
          props: { invalidCurrentPassword: true, csrfToken, currentUser }
        }
      }

      if (newPassword !== confirmPassword) {
        return {
          props: { passwordsMismatch: true, csrfToken, currentUser }
        }
      }

      const baseUrl = req.headers["x-origin"] || req.headers.origin || config.baseUrl

      if (!baseUrl || Array.isArray(baseUrl)) {
        logger.error({ baseUrl }, "baseUrl is invalid")
        return createRedirectResponse("/500")
      }

      const auditLogger = getAuditLogger(context, config)
      const changePasswordResult = await changePassword(
        connection,
        auditLogger,
        currentUser.emailAddress,
        currentPassword,
        newPassword,
        baseUrl
      )

      if (isError(changePasswordResult)) {
        return {
          props: { errorMessage: changePasswordResult.message, csrfToken, currentUser }
        }
      }

      await signOutUser(connection, res, req)

      return createRedirectResponse("/account/change-password/success")
    }

    if (suggestPassword === "true") {
      suggestedPassword = generateRandomPassword()
    }

    return {
      props: { suggestedPassword, suggestedPasswordUrl, csrfToken, currentUser }
    }
  }
)

interface Props {
  csrfToken: string
  currentPasswordMissing?: boolean
  newPasswordMissing?: boolean
  passwordsMismatch?: boolean
  invalidCurrentPassword?: boolean
  errorMessage?: string
  suggestedPassword?: string
  suggestedPasswordUrl?: string
  currentUser?: Partial<User>
}

const ChangePassword = ({
  csrfToken,
  currentUser,
  currentPasswordMissing,
  newPasswordMissing,
  passwordsMismatch,
  invalidCurrentPassword,
  errorMessage,
  suggestedPassword,
  suggestedPasswordUrl
}: Props) => {
  const passwordMismatchError = "Passwords do not match"
  const newPasswordMissingError = "New password is mandatory"
  const newPasswordError =
    (newPasswordMissing && newPasswordMissingError) || (passwordsMismatch && passwordMismatchError) || errorMessage
  const currentPasswordError =
    (currentPasswordMissing && "Current password is mandatory") ||
    (invalidCurrentPassword && "Current password is not valid")

  return (
    <>
      <Head>
        <title>{"Change password"}</title>
      </Head>
      <Layout user={currentUser}>
        <GridRow>
          <GridColumn width="two-thirds">
            <h3 data-test="check-email" className="govuk-heading-xl">
              {"Change your password"}
            </h3>
            <Form method="post" csrfToken={csrfToken}>
              <ErrorSummary
                title="There is a problem"
                show={
                  currentPasswordMissing ||
                  newPasswordMissing ||
                  invalidCurrentPassword ||
                  passwordsMismatch ||
                  !!errorMessage
                }
              >
                <ErrorSummaryList
                  items={[
                    { id: "currentPassword", error: currentPasswordMissing && "Current password field is mandatory." },
                    {
                      id: "currentPassword",
                      error: invalidCurrentPassword && "Provided current password is not valid."
                    },
                    { id: "newPassword", error: newPasswordMissing && "New password field is mandatory." },
                    { id: "newPassword", error: passwordsMismatch && "Provided new passwords do not match." },
                    { id: "newPassword", error: errorMessage }
                  ]}
                />
              </ErrorSummary>

              <TextInput
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                type="password"
                width="20"
                error={currentPasswordError}
              />
              <TextInput
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                width="20"
                error={newPasswordError}
              />
              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                width="20"
                error={passwordsMismatch && passwordMismatchError}
              />

              <Button noDoubleClick>{"Update password"}</Button>
              <SuggestPassword suggestedPassword={suggestedPassword} suggestedPasswordUrl={suggestedPasswordUrl} />
            </Form>
          </GridColumn>
        </GridRow>
      </Layout>
    </>
  )
}

export default ChangePassword
