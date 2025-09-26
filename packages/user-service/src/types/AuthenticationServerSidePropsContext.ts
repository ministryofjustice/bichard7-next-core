import type { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import type { GetServerSidePropsContext } from "next"
import type { ParsedUrlQuery } from "querystring"
import type User from "./User"

type AuthenticationServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  currentUser?: Partial<User>
  authentication?: AuthenticationTokenPayload
  httpsRedirectCookie?: boolean
}

export default AuthenticationServerSidePropsContext
