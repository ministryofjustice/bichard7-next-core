import { GetServerSidePropsContext } from "next"
import QueryString from "qs"
import { ParsedUrlQuery } from "querystring"

type CsrfServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  formData: QueryString.ParsedQs
  csrfToken: string
}

export default CsrfServerSidePropsContext
