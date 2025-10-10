import Button from "components/Button"
import Layout from "components/Layout"
import Link from "components/Link"
import Head from "next/head"
import SuccessBanner from "components/SuccessBanner"
import getConnection from "lib/getConnection"
import setupNewUser from "useCases/setupNewUser"
import { isError } from "types/Result"
import userFormIsValid from "lib/userFormIsValid"
import UserForm, { listOfForces, listOfTriggers } from "components/users/UserForm"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import Form from "components/Form"
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { withAuthentication, withCsrf, withMultipleServerSideProps } from "middleware"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import User from "types/User"
import { isPost } from "utils/http"
import { UserGroupResult } from "types/UserGroup"
import getAuditLogger from "lib/getAuditLogger"
import config from "lib/config"
import ButtonGroup from "components/ButtonGroup"
import createRedirectResponse from "utils/createRedirectResponse"
import { ErrorSummary, ErrorSummaryList } from "components/ErrorSummary"
import IsEmailUnique from "useCases/IsEmailUnique"
import isUsernameUnique from "useCases/isUsernameUnique"
import updateUserCodes from "useCases/updateUserCodes"
import isValidUsername from "utils/isValidUsername"
import logger from "utils/logger"
import isUserWithinGroup from "useCases/isUserWithinGroup"
import getUserHierarchyGroups from "useCases/getUserHierarchyGroups"
import GridRow from "../../components/GridRow"
import GridColumn from "../../components/GridColumn"

export const getServerSideProps = withMultipleServerSideProps(
  withAuthentication,
  withCsrf,
  async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, formData, csrfToken, currentUser } = context as CsrfServerSidePropsContext &
      AuthenticationServerSidePropsContext
    let message = ""
    let isSuccess = true

    if (!currentUser?.username || !currentUser?.id) {
      return createRedirectResponse("/login")
    }

    const connection = getConnection()
    const userGroups = await getUserHierarchyGroups(connection, currentUser.username)

    if (isError(userGroups)) {
      logger.error(userGroups)
      return createRedirectResponse("/500")
    }
    const currentUserVisibleForces = currentUser.visibleForces ?? ""
    const isCurrentSuperUser = await isUserWithinGroup(connection, currentUser?.id || -1, "B7SuperUserManager")

    if (isPost(req)) {
      const userCreateDetails = formData as {
        username: string
        forenames: string
        surname: string
        emailAddress: string
        endorsedBy: string
        orgServes: string
        save: string
        saveAndAddAnother: string
        visibleForces: string
        visibleCourts: string
        excludedTriggers: string
      }

      const userNameValidityResult = isValidUsername(userCreateDetails.username)
      if (userNameValidityResult === false) {
        return {
          props: {
            isSuccess: false,
            isFormValid: false,
            userDetails: userCreateDetails,
            message: "Username is invalid.",
            usernameError:
              "Your username may only contain letters, numbers, dots (.), hyphens(-) and/or underscores (_), your username must also begin and end with a letter or a number",
            csrfToken,
            currentUser,
            userGroups,
            currentUserVisibleForces,
            isCurrentSuperUser
          }
        }
      }

      userCreateDetails.visibleForces = updateUserCodes(listOfForces, "visibleForces", formData)
      if (!userCreateDetails.visibleForces || userCreateDetails.visibleForces === "") {
        return {
          props: {
            isSuccess: false,
            isFormValid: false,
            userDetails: userCreateDetails,
            message: "Please ensure that user is assigned to least one force.",
            forcesError: "Please ensure that user is assigned to least one force.",
            csrfToken,
            currentUser,
            userGroups,
            currentUserVisibleForces,
            isCurrentSuperUser
          }
        }
      }
      userCreateDetails.excludedTriggers = updateUserCodes(listOfTriggers, "excludedTriggers", formData, false)
      const formValidationResult = userFormIsValid(userCreateDetails, false)

      if (formValidationResult.isFormValid) {
        const isUsernameUniqueResult = await isUsernameUnique(connection, userCreateDetails.username)

        if (isError(isUsernameUniqueResult)) {
          return {
            props: {
              isSuccess: false,
              isFormValid: false,
              usernameError: isUsernameUniqueResult.message,
              userDetails: userCreateDetails,
              csrfToken,
              currentUser,
              userGroups,
              currentUserVisibleForces,
              isCurrentSuperUser
            }
          }
        }

        const isEmailAddressUniqueResult = await IsEmailUnique(connection, userCreateDetails.emailAddress)

        if (isError(isEmailAddressUniqueResult)) {
          return {
            props: {
              isSuccess: false,
              isFormValid: false,
              emailError: isEmailAddressUniqueResult.message,
              userDetails: userCreateDetails,
              csrfToken,
              currentUser,
              userGroups,
              currentUserVisibleForces,
              isCurrentSuperUser
            }
          }
        }

        const auditLogger = getAuditLogger(context, config)

        const baseUrl = req.headers["x-origin"] || req.headers.origin || config.baseUrl

        if (!baseUrl || Array.isArray(baseUrl)) {
          logger.error(`baseUrl is invalid: ${baseUrl}`)
          return createRedirectResponse("/500")
        }

        const result = await setupNewUser(connection, auditLogger, currentUser, userCreateDetails, baseUrl)

        if (isError(result)) {
          return {
            props: {
              message: result.message,
              isSuccess: false,
              ...formValidationResult,
              userDetails: userCreateDetails,
              csrfToken,
              currentUser,
              userGroups,
              currentUserVisibleForces,
              isCurrentSuperUser
            }
          }
        }

        if (userCreateDetails.save === "save") {
          return createRedirectResponse("/users?action=user-created")
        }

        message = `User ${userCreateDetails.username} has been successfully created.`
        return {
          props: {
            message,
            isSuccess: true,
            ...formValidationResult,
            csrfToken,
            currentUser,
            userGroups,
            currentUserVisibleForces,
            isCurrentSuperUser
          }
        }
      }

      isSuccess = false
      return {
        props: {
          ...formValidationResult,
          userDetails: userCreateDetails,
          message,
          isSuccess,
          csrfToken,
          currentUser,
          userGroups,
          currentUserVisibleForces,
          isCurrentSuperUser
        }
      }
    }

    return {
      props: {
        message,
        isFormValid: true,
        isSuccess,
        csrfToken,
        currentUser,
        userGroups,
        currentUserVisibleForces,
        isCurrentSuperUser
      }
    }
  }
)

interface Props {
  message?: string
  isSuccess: boolean
  usernameError?: string | false
  forenamesError?: string | false
  surnameError?: string | false
  emailError?: string | false
  forcesError?: string | false
  isFormValid: boolean
  isCurrentSuperUser: boolean
  csrfToken: string
  currentUser?: Partial<User>
  userGroups?: UserGroupResult[]
  userDetails?: Partial<User>
  currentUserVisibleForces: string
}

const NewUser = ({
  message,
  isSuccess,
  usernameError,
  forenamesError,
  surnameError,
  emailError,
  forcesError,
  csrfToken,
  currentUser,
  userGroups,
  userDetails = {},
  isFormValid,
  isCurrentSuperUser,
  currentUserVisibleForces
}: Props) => (
  <>
    <Head>
      <title>{"New User"}</title>
    </Head>
    <Layout user={currentUser}>
      <GridRow>
        <GridColumn width="two-thirds">
          <h1 className="govuk-heading-l">{"Add a new user"}</h1>

          <ErrorSummary title="There is a problem" show={!isFormValid || (!isSuccess && !!message)}>
            <ErrorSummaryList
              items={[
                { id: "username", error: usernameError },
                { id: "forenames", error: forenamesError },
                { id: "surname", error: surnameError },
                { id: "emailAddress", error: emailError },
                { id: "", error: message }
              ]}
            />
          </ErrorSummary>

          {isSuccess && message && <SuccessBanner>{message}</SuccessBanner>}

          <Form method="post" csrfToken={csrfToken}>
            <UserForm
              {...userDetails}
              usernameError={usernameError}
              forenamesError={forenamesError}
              emailError={emailError}
              surnameError={surnameError}
              forcesError={forcesError}
              allGroups={userGroups}
              endorsedBy={currentUser?.username}
              userGroups={userDetails.groups}
              currentUserVisibleForces={currentUserVisibleForces}
              isCurrentSuperUser={isCurrentSuperUser}
            />
            <ButtonGroup>
              <Button data-test="new-user_save" name="save" value="save" noDoubleClick>
                {"Save"}
              </Button>
              <Button variant="secondary" name="saveAndAddAnother" value="saveAndAddAnother" noDoubleClick>
                {"Save and add another"}
              </Button>
            </ButtonGroup>
          </Form>

          <Link href="/users" className="govuk-back-link">
            {"Back"}
          </Link>
        </GridColumn>
      </GridRow>
    </Layout>
  </>
)

export default NewUser
