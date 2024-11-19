import defaults from "./defaults"

const defaultTimeout = process.env.MESSAGE_ENTRY_POINT === "s3" ? 100000 : 30000
const uiScheme = process.env.UI_SCHEME || defaults.uiScheme
const uiHost = process.env.UI_HOST || defaults.uiHost
const uiPort = process.env.UI_PORT || defaults.uiPort

export const authType = {
  bichard: "bichard",
  bichardJwt: "bichard-jwt",
  userService: "user-service"
}

export type Config = {
  authType: string
  baseUrl: string
  messageEntryPoint: string
  noUi: boolean
  parallel: boolean
  realPNC: boolean
  timeout: number
  workerId?: string
}

export const config: Config = {
  authType: process.env.AUTH_TYPE || authType.userService,
  baseUrl: `${uiScheme}://${uiHost}:${uiPort}`,
  messageEntryPoint: process.env.MESSAGE_ENTRY_POINT || "s3",
  noUi: process.env.NO_UI === "true",
  parallel: process.env.CUCUMBER_PARALLEL === "true",
  realPNC: process.env.REAL_PNC === "true",
  timeout: process.env.TEST_TIMEOUT ? parseInt(process.env.TEST_TIMEOUT, 10) : defaultTimeout,
  workerId: process.env.CUCUMBER_WORKER_ID
}
