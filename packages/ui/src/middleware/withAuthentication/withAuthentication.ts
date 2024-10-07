import User from "../../services/entities/User"
import getDataSource from "services/getDataSource"
import parseJwtCookie from "middleware/withAuthentication/parseJwtCookie"
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import { isError, Result } from "types/Result"
import getUser from "services/getUser"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <Props extends { [key: string]: any }>(
  getServerSidePropsFunction: GetServerSideProps<Props>
): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const authJwt = parseJwtCookie(req)
    let currentUser: Result<User | null> = null

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
