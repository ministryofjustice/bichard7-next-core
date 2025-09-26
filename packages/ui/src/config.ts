import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import bannerFirstShownDate from "utils/bannerFirstShownDate"

export const MAX_NOTE_LENGTH = 2000
export const MAX_FEEDBACK_LENGTH = 2000
export const AUDIT_LOG_API_URL = process.env.AUDIT_LOG_API_URL ?? "http://localhost:7010"
export const AUDIT_LOG_API_KEY = process.env.AUDIT_LOG_API_KEY ?? "dummy_api_key"
export const AUDIT_LOG_EVENT_SOURCE = "Bichard New UI"
export const REALLOCATE_CASE_TRIGGER_CODE = TriggerCode.TRPR0028
export const OUT_OF_AREA_TRIGGER_CODE = TriggerCode.TRPR0027
export const SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS = 3
export const COOKIES_SECURE_OPTION = (process.env.COOKIES_SECURE ?? "true") === "true"
export const INFO_BANNER_FIRST_SHOWN = bannerFirstShownDate()

export const API_LOCATION = process.env.API_URL ?? "https://localhost:3333"
export const USE_API = (process.env.USE_API ?? "false") === "true"
export const USE_API_CASE_ENDPOINT = (process.env.USE_API_CASE_ENDPOINT ?? "false") === "true"
export const USE_API_CASES_INDEX_ENDPOINT = (process.env.USE_API_CASES_INDEX_ENDPOINT ?? "false") === "true"
export const FORCES_WITH_API_ENABLED: Set<string> = new Set(
  (process.env.FORCES_WITH_API_ENABLED ?? "").split(",").filter(Boolean)
)
export const FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED: Set<string> = new Set(
  (process.env.FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED ?? "").split(",").filter(Boolean)
)
export const FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED: Set<string> = new Set(
  (process.env.FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED ?? "").split(",").filter(Boolean)
)

const formSecret = process.env.CSRF_FORM_SECRET ?? "OliverTwist2"
const isProduction = process.env.NEXT_PUBLIC_WORKSPACE === "production"

if (isProduction && formSecret === "OliverTwist2") {
  throw new Error("ENV is production and CSRF is set to default value")
}

export const CSRF = {
  tokenName: "CSRFToken",
  formSecret,
  maximumTokenAgeInSeconds: Number(process.env.CSRF_TOKEN_MAX_AGE ?? "600")
}
export const EXCEPTION_PATH_PROPERTY_INDEXES = {
  offenceIndex: 5,
  resultIndex: 7
}

export const DATE_FNS = {
  dateInFuture: 1,
  currentDate: 0,
  dateInPast: -1
}
