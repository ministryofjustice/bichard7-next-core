import config from "lib/config"
import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import type { ParsedUrlQuery } from "querystring"
import type CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import setCookie from "utils/setCookie"
import generateCsrfToken from "./generateCsrfToken"
import verifyCsrfToken from "./verifyCsrfToken"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withCsrf = <Props extends { [key: string]: any }>(
  getServerSidePropsFunction: GetServerSideProps<Props>
): GetServerSideProps<Props> => {
  return async (context: GetServerSidePropsContext<ParsedUrlQuery>): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const { isValid, formData } = await verifyCsrfToken(req)

    if (!isValid) {
      res.statusCode = 403
      res.statusMessage = "Invalid CSRF-token"
      res.setHeader("X-Status-Message", "Invalid CSRF-token")
      res.end()
      return { props: {} } as unknown as GetServerSidePropsResult<Props>
    }

    const { maximumTokenAgeInSeconds } = config.csrf
    const { formToken, cookieToken, cookieName } = generateCsrfToken(req, config)
    setCookie(res, cookieName, cookieToken, { maxAge: maximumTokenAgeInSeconds })

    return getServerSidePropsFunction({ ...context, formData, csrfToken: formToken } as CsrfServerSidePropsContext)
  }
}

export default withCsrf
