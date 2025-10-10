import type { GetServerSidePropsContext } from "next"
import type QueryString from "qs"
import type { ParsedUrlQuery } from "querystring"

type CsrfServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  formData: QueryString.ParsedQs
  csrfToken: string
}

export default CsrfServerSidePropsContext
