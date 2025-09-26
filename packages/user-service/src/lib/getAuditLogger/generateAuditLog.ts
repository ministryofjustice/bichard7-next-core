import type { GetServerSidePropsContext } from "next"
import AuditLog from "types/AuditLog"
import type AuthenticationServerSidePropsContext from "types/AuthenticationServerSidePropsContext"
import type KeyValuePair from "types/KeyValuePair"

type AttributesWithUser = { user?: { username?: string } }

const filterAttributes = (
  attrs: KeyValuePair<string, unknown> | undefined
): KeyValuePair<string, unknown> | undefined => {
  if (!attrs) {
    return attrs
  }

  if (attrs.user && typeof attrs.user === "object") {
    const user = attrs.user as { password?: string; migratedPassword?: string; emailVerificationCode?: string }
    user.password = undefined
    user.migratedPassword = undefined
    user.emailVerificationCode = undefined
  }

  return attrs
}

const generateAuditLog = (
  context: GetServerSidePropsContext,
  code: string,
  description: string,
  attributes?: KeyValuePair<string, unknown>
): AuditLog => {
  const {
    req: { socket, url },
    currentUser
  } = context as AuthenticationServerSidePropsContext

  const remoteAddress = String(socket?.remoteAddress)
  const username = currentUser?.username ?? (attributes as AttributesWithUser)?.user?.username ?? "Anonymous"

  return new AuditLog(description, code, username, remoteAddress, String(url), filterAttributes(attributes))
}

export default generateAuditLog
