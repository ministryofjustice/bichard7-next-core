import type User from "services/entities/User"
import { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"

type AuthenticationServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  currentUser: User
}

export default AuthenticationServerSidePropsContext
