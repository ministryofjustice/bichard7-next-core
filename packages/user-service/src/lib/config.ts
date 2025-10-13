import type { StringValue } from "ms"
import type Argon2Config from "types/Argon2Config"
import type CsrfConfig from "types/CsrfConfig"
import type DatabaseConfig from "./DatabaseConfig"

interface SmtpConfig {
  host: string
  user: string
  password: string
  port: number
  tls: boolean
}

export interface UserServiceConfig {
  argon2: Argon2Config
  auditLogApiUrl?: string
  auditLogApiKey?: string
  auditLoggerType: "console" | "audit-log-api"
  authenticationCookieName: string
  baseUrl?: string
  bichardRedirectURL: string
  bichardRedirectToCaseListURL: string
  newBichardRedirectURL: string
  cookieSecret: string
  cookiesSecureOption: boolean
  csrf: CsrfConfig
  database: DatabaseConfig
  debugMode: string
  emailFrom: string
  emailVerificationExpiresIn: number
  incorrectDelay: number
  passwordMinLength: number
  rememberEmailAddressCookieName: string
  rememberEmailAddressMaxAgeInMinutes: number
  serviceMessagesStaleDays: number
  supportEmail: string
  supportCJSMEmail: string
  suggestedPasswordNumWords: number
  suggestedPasswordMinWordLength: number
  suggestedPasswordMaxWordLength: number
  smtp: SmtpConfig
  tokenExpiresIn: StringValue
  tokenIssuer: string
  tokenSecret: string
  maxPasswordFailedAttempts: number
  maxServiceMessagesPerPage: number
  maxUsersPerPage: number
  verificationCodeLength: number
}

const getConfig = (): UserServiceConfig => ({
  argon2: {
    hashLength: 32,
    memoryCost: 15360,
    parallelism: 1,
    timeCost: 2
  },
  auditLogApiKey: process.env.AUDIT_LOG_API_KEY,
  auditLogApiUrl: process.env.AUDIT_LOG_API_URL,
  auditLoggerType: process.env.AUDIT_LOG_API_URL && process.env.AUDIT_LOG_API_KEY ? "audit-log-api" : "console",
  authenticationCookieName: ".AUTH",
  baseUrl: process.env.BASE_URL,
  bichardRedirectURL: process.env.BICHARD_REDIRECT_URL ?? "/bichard-ui/InitialRefreshList",
  bichardRedirectToCaseListURL: "/bichard-ui/RefreshListNoRedirect",
  newBichardRedirectURL: process.env.NEW_BICHARD_REDIRECT_URL ?? "/bichard",
  cookieSecret: process.env.COOKIE_SECRET ?? "OliverTwist",
  cookiesSecureOption: (process.env.COOKIES_SECURE ?? "true") === "true",
  debugMode: "false",
  emailFrom: `Bichard7 <${process.env.EMAIL_FROM ?? "bichard@cjse.org"}>`,
  emailVerificationExpiresIn: Number.parseInt(process.env.EMAIL_VERIFICATION_EXPIRY ?? "30", 10),
  incorrectDelay: Number.parseInt(process.env.INCORRECT_DELAY ?? "10", 10),
  passwordMinLength: 8,
  rememberEmailAddressCookieName: "LOGIN_EMAIL",
  rememberEmailAddressMaxAgeInMinutes: Number.parseInt(process.env.REMEMBER_EMAIL_MAX_AGE ?? "1440", 10),
  serviceMessagesStaleDays: Number.parseInt(process.env.SERVICE_MESSAGES_STALE_DAYS ?? "30", 10),
  supportEmail: process.env.SUPPORT_EMAIL ?? "moj-bichard7@madetech.com",
  supportCJSMEmail: process.env.SUPPORT_CJSM_EMAIL ?? "moj-bichard7@madetech.cjsm.net",
  suggestedPasswordNumWords: 3,
  suggestedPasswordMinWordLength: 3,
  suggestedPasswordMaxWordLength: 8,
  tokenExpiresIn: (process.env.TOKEN_EXPIRES_IN as StringValue) ?? "10 minutes",
  tokenIssuer: process.env.TOKEN_ISSUER ?? "Bichard",
  tokenSecret: process.env.TOKEN_SECRET ?? "OliverTwist",
  maxPasswordFailedAttempts: 3,
  maxServiceMessagesPerPage: 5,
  maxUsersPerPage: 10,
  verificationCodeLength: 6,
  csrf: {
    tokenName: "CSRFToken",
    cookieSecret: process.env.CSRF_COOKIE_SECRET ?? "OliverTwist1",
    formSecret: process.env.CSRF_FORM_SECRET ?? "OliverTwist2",
    maximumTokenAgeInSeconds: Number(process.env.CSRF_TOKEN_MAX_AGE ?? "600")
  },
  database: {
    host: process.env.DB_HOST ?? process.env.DB_AUTH_HOST ?? "localhost",
    user: process.env.DB_USER ?? process.env.DB_AUTH_USER ?? "bichard",
    password: process.env.DB_PASSWORD ?? process.env.DB_AUTH_PASSWORD ?? "password",
    database: process.env.DB_DATABASE ?? process.env.DB_AUTH_DATABASE ?? "bichard",
    port: Number.parseInt(process.env.DB_PORT ?? process.env.DB_AUTH_PORT ?? "5432", 10),
    ssl: (process.env.DB_SSL ?? process.env.DB_AUTH_SSL) === "true"
  },
  smtp: {
    host: process.env.SMTP_HOST ?? "console",
    user: process.env.SMTP_USER ?? "bichard",
    password: process.env.SMTP_PASSWORD ?? "password",
    port: Number.parseInt(process.env.SMTP_PORT ?? "587", 10),
    tls: process.env.SMTP_TLS === "true"
  }
})

const config = getConfig()

export { getConfig }
export default config
