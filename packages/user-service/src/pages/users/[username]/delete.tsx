import Button from "components/Button"
import ButtonGroup from "components/ButtonGroup"
import { ErrorSummaryList } from "components/ErrorSummary"
import ErrorSummary from "components/ErrorSummary/ErrorSummary"
import { Fieldset, FieldsetHint, FieldsetLegend } from "components/Fieldset"
import Form from "components/Form"
import Layout from "components/Layout"
import Link from "components/Link"
import TextInput from "components/TextInput"
import Warning from "components/Warning"
import config from "lib/config"
import getAuditLogger from "lib/getAuditLogger"
import getConnection from "lib/getConnection"
import usersHaveSameForce from "lib/usersHaveSameForce"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import useCustomStyles from "styles/useCustomStyles"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import { isError } from "types/Result"
import User from "types/User"
import { deleteUser, getUserByUsername } from "useCases"
import isUserWithinGroup from "useCases/isUserWithinGroup"
import createRedirectResponse from "utils/createRedirectResponse"
import { isPost } from "utils/http"
import logger from "utils/logger"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    const { username } = query

    if (!currentUser) {
      logger.error("Unable to determine current user")
      return createRedirectResponse("/500")
    }

    const connection = getConnection()
    const user = await getUserByUsername(connection, username as string)

    if (isError(user)) {
      logger.error(user)
      return createRedirectResponse("/500")
    }

    const isCurrentSuperUser = await isUserWithinGroup(connection, currentUser?.id || -1, "B7SuperUserManager")
    if (!user || (!usersHaveSameForce(currentUser, user) && !isCurrentSuperUser)) {
      return {
        notFound: true
      }
    }

    if (isPost(req)) {
      const { deleteAccountConfirmation } = formData as { deleteAccountConfirmation: string }

      if (user.username !== deleteAccountConfirmation) {
        return {
          props: {
            user,
            showInputNotMatchingError: true,
            csrfToken,
            currentUser
          }
        }
      }

      const auditLogger = getAuditLogger(context, config)

      let deleteUserResult

      if (currentUser.id && currentUser.id !== user.id) {
        deleteUserResult = await deleteUser(connection, auditLogger, user, currentUser)
      } else {
        return {
          props: {
            user,
            csrfToken,
            currentUser,
            isCurrentUserToBeDeleted: true
          }
        }
      }

      if (deleteUserResult.isDeleted) {
        return createRedirectResponse(`/users?action=user-deleted`)
      }

      if (deleteUserResult.serverSideError) {
        logger.error(deleteUserResult.serverSideError)
        return createRedirectResponse("/500")
      }
    }

    return {
      props: { user, csrfToken, currentUser }
    }
  }
)

interface Props {
  user: Partial<User>
  showInputNotMatchingError?: boolean
  csrfToken: string
  currentUser?: Partial<User>
  isCurrentUserToBeDeleted?: boolean
}

const Delete = ({ user, showInputNotMatchingError, csrfToken, currentUser, isCurrentUserToBeDeleted }: Props) => {
  const fullName = `${user.forenames} ${user.surname}`
  const classes = useCustomStyles()

  return (
    <>
      <Head>
        <title>{"Users"}</title>
      </Head>
      <Layout user={currentUser}>
        <div className={`${classes["top-padding"]}`}>
          <Form method="post" csrfToken={csrfToken}>
            <Fieldset>
              <FieldsetLegend>{`Are you sure you want to delete ${fullName}?`}</FieldsetLegend>
              <FieldsetHint>
                <Warning>{"This action is irreversible."}</Warning>
              </FieldsetHint>
              <ErrorSummary title="Username mismatch" show={!!showInputNotMatchingError}>
                <ErrorSummaryList
                  items={[
                    {
                      id: "delete-account-confirmation",
                      error: "Enter the account username"
                    }
                  ]}
                />
              </ErrorSummary>

              <TextInput
                id="delete-account-confirmation"
                name="deleteAccountConfirmation"
                label={`If you are sure about deleting this account, type '${user.username}' in the box below.`}
                type="text"
                width="20"
                error={showInputNotMatchingError && "Username does not match"}
              />
            </Fieldset>

            <ErrorSummary title="There is a problem" show={!!isCurrentUserToBeDeleted}>
              {!!isCurrentUserToBeDeleted && (
                <p>{"A user may not delete themselves, please contact another user manager to delete your user"}</p>
              )}
            </ErrorSummary>
            <ButtonGroup>
              <Button
                dataTest="delete_delete-account-btn"
                variant="warning"
                noDoubleClick
                isDisabled={isCurrentUserToBeDeleted}
              >
                {"Delete account"}
              </Button>
              <Link data-test="cancel" href={`/users/${user.username}`}>
                {"Cancel"}
              </Link>
            </ButtonGroup>
          </Form>
        </div>
      </Layout>
    </>
  )
}

export default Delete
