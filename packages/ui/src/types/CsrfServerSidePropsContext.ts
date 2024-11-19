import type { GetServerSidePropsContext } from "next"
import type QueryString from "qs"
import type { ParsedUrlQuery } from "querystring"

type CsrfServerSidePropsContext = {
  csrfToken: string
  formData: QueryString.ParsedQs
} & GetServerSidePropsContext<ParsedUrlQuery>

export default CsrfServerSidePropsContext
