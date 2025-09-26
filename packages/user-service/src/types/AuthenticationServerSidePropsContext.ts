import { AuthenticationTokenPayload } from "lib/token/authenticationToken"
import { GetServerSidePropsContext } from "next"
import { ParsedUrlQuery } from "querystring"
import User from "./User"

type AuthenticationServerSidePropsContext = GetServerSidePropsContext<ParsedUrlQuery> & {
  currentUser?: Partial<User>
  authentication?: AuthenticationTokenPayload
  httpsRedirectCookie?: boolean
}

export default AuthenticationServerSidePropsContext
