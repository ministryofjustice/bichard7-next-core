import type { Court } from "@moj-bichard7/core/types/leds/DisposalRequest"

export const extractCourtCode = (court: Court | undefined): string | undefined =>
  court?.courtIdentityType === "code" ? court.courtCode : undefined

export const extractCourtName = (court: Court | undefined): string | undefined =>
  court?.courtIdentityType === "name" ? court.courtName : undefined
