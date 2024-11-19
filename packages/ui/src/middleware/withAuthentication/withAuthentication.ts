import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import type { ParsedUrlQuery } from "querystring"
import type AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import type { Result } from "types/Result"

import parseJwtCookie from "middleware/withAuthentication/parseJwtCookie"
import getDataSource from "services/getDataSource"
import getUser from "services/getUser"
import { isError } from "types/Result"

import type User from "../../services/entities/User"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <Props extends { [key: string]: any }>(
  getServerSidePropsFunction: GetServerSideProps<Props>
): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const authJwt = parseJwtCookie(req)
    let currentUser: Result<null | User> = null

    if (authJwt) {
      const dataSource = await getDataSource()
      currentUser = await getUser(dataSource, authJwt.username, authJwt.groups)
    }

    if (isError(currentUser)) {
      console.error("Failed to retrieve user with error:", currentUser.message)

      res.statusCode = 502
      res.statusMessage = "Bad Gateway"
      res.end()
      return { props: {} } as unknown as GetServerSidePropsResult<Props>
    }

    if (!currentUser) {
      res.statusCode = 401
      res.statusMessage = "Unauthorized"
      res.end()
      return { props: {} } as unknown as GetServerSidePropsResult<Props>
    }

    return getServerSidePropsFunction({
      ...context,
      currentUser
    } as AuthenticationServerSidePropsContext)
  }

  return result
}
