import getConnection from "lib/getConnection"
import { isTokenIdValid } from "lib/token/authenticationToken"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isSuccess } from "types/Result"
import User from "types/User"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"
import setCookie from "utils/setCookie"
import logger from "utils/logger"
import getAuthenticationPayloadFromCookie from "./getAuthenticationPayloadFromCookie"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <Props extends { [key: string]: any }>(
  getServerSidePropsFunction: GetServerSideProps<Props>
): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const connection = getConnection()

    const authToken = getAuthenticationPayloadFromCookie(req)
    let currentUser: User | null = null
    let httpsRedirectCookie = Boolean(req?.cookies?.httpsRedirect)

    if (authToken && (await isTokenIdValid(connection, authToken.id))) {
      const user = await getUserByEmailAddress(connection, authToken.emailAddress)

      if (isSuccess(user)) {
        currentUser = user
        // check if user should redirect
        const isDevEmail =
          currentUser?.emailAddress &&
          (currentUser?.emailAddress.includes("@example.com") || currentUser?.emailAddress.includes("@madetech.com"))

        // set cookie if it is not already set
        if ((isDevEmail || currentUser?.featureFlags?.httpsRedirect) && !httpsRedirectCookie) {
          setCookie(res, "httpsRedirect", "true", { path: "/" })
          httpsRedirectCookie = true
        }
      } else {
        logger.error(user)
      }
    }

    return getServerSidePropsFunction({
      ...context,
      currentUser,
      authentication: authToken,
      httpsRedirectCookie
    } as AuthenticationServerSidePropsContext)
  }

  return result
}
