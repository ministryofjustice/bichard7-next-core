import defaults from "./defaults"

const defaultTimeout = process.env.MESSAGE_ENTRY_POINT === "s3" ? 100000 : 30000
const uiScheme = process.env.UI_SCHEME || defaults.uiScheme
const uiHost = process.env.UI_HOST || defaults.uiHost
const uiPort = process.env.UI_PORT || defaults.uiPort

export const authType = {
  bichard: "bichard",
  userService: "user-service",
  bichardJwt: "bichard-jwt"
}

export type Config = {
  timeout: number
  baseUrl: string
  parallel: boolean
  workerId?: string
  authType: string
  noUi: boolean
  messageEntryPoint: string
  realPNC: boolean
}

export const config: Config = {
  timeout: process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT, 10) : defaultTimeout,
  baseUrl: `${uiScheme}://${uiHost}:${uiPort}`,
  parallel: process.env.CUCUMBER_PARALLEL === "true",
  workerId: process.env.CUCUMBER_WORKER_ID,
  authType: process.env.AUTH_TYPE || authType.userService,
  noUi: process.env.NO_UI === "true",
  messageEntryPoint: process.env.MESSAGE_ENTRY_POINT || "s3",
  realPNC: process.env.REAL_PNC === "true"
}
