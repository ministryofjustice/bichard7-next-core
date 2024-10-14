import type User from "services/entities/User"
import type { GetServerSidePropsContext } from "next"
import type { ParsedUrlQuery } from "querystring"

type AuthenticationServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  currentUser: User
}

export default AuthenticationServerSidePropsContext
