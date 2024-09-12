import { config } from "./config"

const nextui = process.env.NEXTUI === "true"
const url = (path: string) => `${config.baseUrl}${path}`

export const caseListPage = () => url(nextui ? "/bichard" : "/bichard-ui/InitialRefreshList")
export const authenticateUrl = (token: string) => url(`/bichard-ui/Authenticate?token=${token}`)
export const logout = () => url("/bichard-ui/bichard-lo")
export const login = () => url("/users/login")
