import type { IncomingMessage } from "http"
import type User from "types/User"
import { getCaseDetailsCookieName } from "./getCaseDetailsCookieName"

const courtCaseDetailsRedirect = (req: IncomingMessage, currentUser: Partial<User> | undefined): string => {
  if (!currentUser) {
    return ""
  }

  const caseDetailsCookieName = getCaseDetailsCookieName(currentUser.username)

  if (!caseDetailsCookieName) {
    return ""
  }

  const cookies = req.headers.cookie?.split("; ")
  const regex = new RegExp(`${caseDetailsCookieName}=\\d+`)
  const caseDetailCookie = cookies?.find((c) => regex.test(c))
  const redirectToCourtDetails = caseDetailCookie?.replace(`${caseDetailsCookieName}=`, "")

  const caseDetails404Name = "qa_case_details_404"
  const caseDetail404Cookie = cookies?.find((c) => c.startsWith(caseDetails404Name))

  let hasCaseDetails404ErrorId = false

  if (caseDetail404Cookie) {
    const match = /bichard\/court-case\/(\d+)$/.exec(caseDetail404Cookie)

    if (match) {
      hasCaseDetails404ErrorId = !!match[1]
    }
  }

  if (!redirectToCourtDetails || hasCaseDetails404ErrorId) {
    return ""
  }

  const decodedCourtDetailsRedirect = decodeURIComponent(redirectToCourtDetails)
  const [errorId, previousPath] = decodedCourtDetailsRedirect.split("?previousPath=")
  const courtCaseDetails = `/court-cases/${errorId}?previousPath=${encodeURIComponent(previousPath)}`

  return courtCaseDetails
}

export default courtCaseDetailsRedirect
