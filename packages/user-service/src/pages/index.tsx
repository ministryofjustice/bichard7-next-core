import ContactLink from "components/ContactLink"
import GridColumn from "components/GridColumn"
import GridRow from "components/GridRow"
import Layout from "components/Layout"
import Link from "components/Link"
import NotificationBanner from "components/NotificationBanner"
import Pagination from "components/Pagination"
import Paragraph from "components/Paragraph"
import ServiceMessages from "components/ServiceMessages"
import ForceBrowserShareAssets from "components/StatsGathering/ForceBrowserShareAssets"
import UserManagers from "components/UserManagers"
import { deleteCookie } from "cookies-next"
import config from "lib/config"
import getConnection from "lib/getConnection"
import { withAuthentication, withMultipleServerSideProps } from "middleware"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import Head from "next/head"
import { ParsedUrlQuery } from "querystring"
import { useEffect } from "react"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError } from "types/Result"
import ServiceMessage from "types/ServiceMessage"
import { LocalStorageKey, Ui } from "types/Ui"
import User from "types/User"
import getServiceMessages from "useCases/getServiceMessages"
import getUserManagersForForce from "useCases/getUserManagersForForce"
import getUserServiceAccess from "useCases/getUserServiceAccess"
import courtCaseDetailsRedirect from "utils/courtCaseDetailsRedirect"
import createRedirectResponse from "utils/createRedirectResponse"
import logger from "utils/logger"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { currentUser, authentication, query, req } = context as AuthenticationServerSidePropsContext

    if (!currentUser || !authentication) {
      return createRedirectResponse("/login")
    }

    const { page } = query as { page: string }
    const pageNumber = page ? Number.parseInt(page, 10) : 0

    const { hasAccessToBichard, hasAccessToUserManagement, hasAccessToNewBichard } =
      getUserServiceAccess(authentication)
    const connection = getConnection()
    let serviceMessagesResult = await getServiceMessages(connection, pageNumber)

    if (isError(serviceMessagesResult)) {
      logger.error(serviceMessagesResult)
      serviceMessagesResult = { result: [], totalElements: 0 }
    }

    const currentUserManagers = await getUserManagersForForce(connection, currentUser.visibleForces)

    if (isError(currentUserManagers)) {
      logger.error(currentUserManagers)
    }

    const courtCaseDetails = courtCaseDetailsRedirect(req, currentUser)

    return {
      props: {
        currentUser,
        currentUserManagerNames: isError(currentUserManagers)
          ? [""]
          : currentUserManagers.map((cu) => (cu.forenames ? cu.forenames : "") + " " + (cu.surname ? cu.surname : "")),
        hasAccessToUserManagement,
        hasAccessToBichard,
        hasAccessToNewBichard,
        serviceMessages: JSON.parse(JSON.stringify(serviceMessagesResult.result)),
        pageNumber,
        totalMessages: serviceMessagesResult.totalElements,
        courtCaseDetails
      }
    }
  }
)

interface Props {
  currentUser?: Partial<User>
  currentUserManagerNames: string[]
  hasAccessToUserManagement: boolean
  hasAccessToBichard: boolean
  hasAccessToNewBichard: boolean
  serviceMessages: ServiceMessage[]
  pageNumber: number
  totalMessages: number
  courtCaseDetails: string
}

const Home = ({
  currentUser,
  currentUserManagerNames,
  hasAccessToUserManagement,
  hasAccessToBichard,
  hasAccessToNewBichard,
  serviceMessages,
  pageNumber,
  totalMessages,
  courtCaseDetails
}: Props) => {
  useEffect(() => {
    deleteCookie("qa_case_details_404")
  })

  return (
    <>
      <Head>
        <title>{"Home"}</title>
      </Head>
      <Layout user={currentUser}>
        <GridRow>
          <GridColumn width="two-thirds">
            <h1 className="govuk-heading-l">{`Welcome ${currentUser?.forenames} ${currentUser?.surname}`}</h1>

            {hasAccessToBichard && (
              <Link
                href={config.bichardRedirectURL}
                basePath={false}
                className="govuk-button govuk-button--start govuk-!-margin-top-5"
                id="bichard-link"
                onClick={() => localStorage.setItem(LocalStorageKey.CurrentUi, Ui.Old)}
              >
                {"Access Bichard"}
                <svg
                  className="govuk-button__start-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17.5"
                  height="19"
                  viewBox="0 0 33 40"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
                </svg>
              </Link>
            )}

            {!hasAccessToBichard && (
              <Paragraph>
                {
                  "You do not have any Bichard groups associated with your account. If this is incorrect, please contact a User Manager in your force."
                }
              </Paragraph>
            )}

            {hasAccessToNewBichard && (
              <>
                <br />
                <Link
                  href={config.newBichardRedirectURL + courtCaseDetails}
                  basePath={false}
                  className="govuk-button govuk-button--start govuk-!-margin-top-5"
                  id="bichard-link"
                  onClick={() => localStorage.setItem(LocalStorageKey.CurrentUi, Ui.New)}
                >
                  {"Access New Bichard"}
                  <svg
                    className="govuk-button__start-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.5"
                    height="19"
                    viewBox="0 0 33 40"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
                  </svg>
                </Link>
              </>
            )}

            {hasAccessToUserManagement && (
              <>
                <h3 className="govuk-heading-m govuk-!-margin-top-5" id="services-title">
                  {"Quick access"}
                </h3>
                <nav role="navigation" aria-labelledby="services-title">
                  <ul className="govuk-list">
                    {hasAccessToUserManagement && (
                      <li>
                        <Link href="/users" className="govuk-link govuk-link--no-underline" id="user-management-link">
                          {"User management"}
                        </Link>
                      </li>
                    )}
                  </ul>
                </nav>
              </>
            )}

            <h3 className="govuk-heading-m govuk-!-margin-top-5">{"Need help?"}</h3>

            <UserManagers userManagerNames={currentUserManagerNames} />

            <Paragraph>
              {"If you need help with anything else, you can "}
              <ContactLink>{"contact support"}</ContactLink>
              {"."}
            </Paragraph>

            <Paragraph>
              {"If you have any feedback you wish to share, please use "}
              <Link href={"/feedback"}>{"this link"}</Link>
              {"."}
            </Paragraph>
          </GridColumn>

          <GridColumn width="one-third">
            <h2 className="govuk-heading-m">{"Latest service messages"}</h2>

            <ServiceMessages messages={serviceMessages} />

            <Pagination
              pageNumber={pageNumber}
              totalItems={totalMessages}
              maxItemsPerPage={config.maxServiceMessagesPerPage}
              href="/"
              className="govuk-!-font-size-16"
            />

            <NotificationBanner heading="There are new features available on new Bichard">
              <Paragraph>
                {"View "}
                <Link basePath={false} href={"/help/whats-new/"} target={"_blank"}>
                  {"the help guidance for new features"}
                </Link>
                {"."}
              </Paragraph>
            </NotificationBanner>
          </GridColumn>
        </GridRow>
      </Layout>
      <script src={`http://bichard7.service.justice.gov.uk/forces.js?forceID=${currentUser?.visibleForces}`} async />

      {currentUser?.visibleForces && currentUser.id && (
        <ForceBrowserShareAssets visibleForces={currentUser?.visibleForces} userId={currentUser.id} />
      )}
    </>
  )
}

export default Home
