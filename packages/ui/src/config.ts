import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

export const MAX_NOTE_LENGTH = 2000
export const MAX_FEEDBACK_LENGTH = 2000
export const AUDIT_LOG_API_URL = process.env.AUDIT_LOG_API_URL ?? "http://localhost:7010"
export const AUDIT_LOG_API_KEY = process.env.AUDIT_LOG_API_KEY ?? "dummy_api_key"
export const AUDIT_LOG_EVENT_SOURCE = "Bichard New UI"
export const REALLOCATE_CASE_TRIGGER_CODE = TriggerCode.TRPR0028
export const OUT_OF_AREA_TRIGGER_CODE = TriggerCode.TRPR0027
export const SWITCHING_FEEDBACK_FORM_FREQUENCY_IN_HOURS = 3
export const COOKIES_SECURE_OPTION = (process.env.COOKIES_SECURE ?? "true") === "true"
export const CSRF = {
  tokenName: "CSRFToken",
  formSecret: process.env.CSRF_FORM_SECRET ?? "OliverTwist2",
  maximumTokenAgeInSeconds: parseInt(process.env.CSRF_TOKEN_MAX_AGE ?? "600", 10)
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
