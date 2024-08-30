import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { ParsedUrlQuery } from "querystring"
import CsrfServerSidePropsContext from "types/CsrfServerSidePropsContext"
import generateCsrfToken from "./generateCsrfToken"
import verifyCsrfToken from "./verifyCsrfToken"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default <Props extends { [key: string]: any }>(
  getServerSidePropsFunction: GetServerSideProps<Props>
): GetServerSideProps<Props> => {
  const result: GetServerSideProps<Props> = async (
    context: GetServerSidePropsContext<ParsedUrlQuery>
  ): Promise<GetServerSidePropsResult<Props>> => {
    const { req, res } = context
    const { isValid, formData } = await verifyCsrfToken(req)

    if (!isValid) {
      res.statusCode = 403
      res.statusMessage = "Invalid CSRF-token"
      res.setHeader("X-Status-Message", "Invalid CSRF-token")
      res.end()
      return { props: {} } as unknown as GetServerSidePropsResult<Props>
    }

    const formToken = generateCsrfToken(req)

    return getServerSidePropsFunction({ ...context, formData, csrfToken: formToken } as CsrfServerSidePropsContext)
  }

  return result
}
