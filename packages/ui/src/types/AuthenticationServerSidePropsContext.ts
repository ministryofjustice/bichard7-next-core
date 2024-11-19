import type { GetServerSidePropsContext } from "next"
import type { ParsedUrlQuery } from "querystring"
import type User from "services/entities/User"

type AuthenticationServerSidePropsContext = {
  currentUser: User
} & GetServerSidePropsContext<ParsedUrlQuery>

export default AuthenticationServerSidePropsContext
