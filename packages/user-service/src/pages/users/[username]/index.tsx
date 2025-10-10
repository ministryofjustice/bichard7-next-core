import BackLink from "components/BackLink"
import ButtonGroup from "components/ButtonGroup"
import Layout from "components/Layout"
import Link from "components/Link"
import { Summary, SummaryItem } from "components/Summary"
import getConnection from "lib/getConnection"
import usersHaveSameForce from "lib/usersHaveSameForce"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import useCustomStyles from "styles/useCustomStyles"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import User from "types/User"
import { getUserByUsername } from "useCases"
import getUserServiceAccess, { type UserServiceAccess } from "useCases/getUserServiceAccess"
import isUserWithinGroup from "useCases/isUserWithinGroup"
import createRedirectResponse from "utils/createRedirectResponse"
import logger from "utils/logger"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { query, currentUser, authentication } = context as AuthenticationServerSidePropsContext
    const { username } = query as { username: string }

    if (!currentUser) {
      logger.error("Unable to determine current user")
      return createRedirectResponse("/500")
    }

    if (!currentUser || !authentication) {
      return createRedirectResponse("/login")
    }

    const hasAccessTo = getUserServiceAccess(authentication)

    const connection = getConnection()
    const user = await getUserByUsername(connection, username)

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

    const isCurrentUserToBeDeleted = currentUser.id === user.id

    return {
      props: { user, currentUser, isCurrentUserToBeDeleted, hasAccessTo }
    }
  }
)

interface Props {
  user: User
  currentUser?: Partial<User>
  isCurrentUserToBeDeleted?: boolean
  hasAccessTo: UserServiceAccess
}

const Users = ({ user, currentUser, isCurrentUserToBeDeleted, hasAccessTo }: Props) => {
  const classes = useCustomStyles()
  return (
    <>
      <Head>
        <title>{"User details"}</title>
      </Head>
      <Layout user={currentUser} hasAccessTo={hasAccessTo}>
        <div className={`${classes["top-padding"]}`}>
          <h2 className="govuk-heading-l">{"User details"}</h2>
          <Summary>
            <SummaryItem label="Username" value={user.username} dataTest={"username"} />
            <SummaryItem label="Forename(s)" value={user.forenames} dataTest={"forename"} />
            <SummaryItem label="Surname" value={user.surname} dataTest={"surname"} />
            <SummaryItem label="Email address" value={user.emailAddress} dataTest={"email-address"} />
            <SummaryItem label="Endorsed by" value={user.endorsedBy} dataTest={"endorsed-by"} />
            <SummaryItem label="Organisation" value={user.orgServes} dataTest={"organisation"} />
            <SummaryItem label="Visible Forces" value={user.visibleForces} dataTest={"visible-forces"} />
            <SummaryItem label="Visible Courts" value={user.visibleCourts} dataTest={"visible-courts"} />
            <SummaryItem label="Excluded Triggers" value={user.excludedTriggers} dataTest={"excluded-triggers"} />
            <SummaryItem
              label="Group Memberships"
              value={user.groups.map((g) => g.friendly_name).join(", ")}
              dataTest={"group-memberships"}
            />
          </Summary>

          <ButtonGroup>
            <Link data-test="edit-user-view" href={`${user.username}/edit`}>
              {"Edit details"}
            </Link>
            {isCurrentUserToBeDeleted ? (
              <button
                data-test="disabled-delete-anchor"
                title="A user may not delete themselves, please contact another user manager to delete your user"
                className="disabled-link"
                type="button"
              >
                {"Delete account"}
              </button>
            ) : (
              <Link data-test="delete-user-view" href={`${user.username}/delete`}>
                {"Delete account"}
              </Link>
            )}
          </ButtonGroup>
          <BackLink href="/users" />
        </div>
      </Layout>
    </>
  )
}

export default Users
