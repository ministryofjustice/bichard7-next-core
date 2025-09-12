import type { PoliceOffence } from "@moj-bichard7/common/types/PoliceQueryResult"

export type Candidates = { courtCaseReference: string; offences: PoliceOffence[] }
