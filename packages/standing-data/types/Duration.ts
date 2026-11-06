export enum Duration {
  DAYS = "D",
  HOURS = "H",
  LIFE = "L",
  MONTHS = "M",
  SESSIONS = "S",
  WEEKS = "W",
  YEARS = "Y"
}

export const Durations: Record<Duration, string> = {
  [Duration.DAYS]: "days",
  [Duration.HOURS]: "hours",
  [Duration.LIFE]: "life",
  [Duration.MONTHS]: "months",
  [Duration.SESSIONS]: "sessions",
  [Duration.WEEKS]: "weeks",
  [Duration.YEARS]: "years"
}
