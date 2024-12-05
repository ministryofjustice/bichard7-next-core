import hashString from "./hashString"

const getCaseDetailsCookieName = (username: string) => `qs_case_details_${hashString(username)}`

export default getCaseDetailsCookieName
