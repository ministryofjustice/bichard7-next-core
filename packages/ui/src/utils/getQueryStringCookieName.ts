import hashString from "./hashString"

const getQueryStringCookieName = (username: string) => `qs_case_list_${hashString(username)}`

export default getQueryStringCookieName
