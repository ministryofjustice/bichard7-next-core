import type { Court } from "@moj-bichard7/core/types/leds/DisposalRequest"

export const extractCourtCode = (court: Court | undefined): string | undefined =>
  court?.courtIdentityType === "code" ? court.courtCode : undefined

export const extractCourtName = (court: Court | undefined): string | undefined =>
  court?.courtIdentityType === "name" ? court.courtName : undefined

export const toApcoOffenceCode = (npccOffenceCode: string | undefined) => npccOffenceCode?.replace(/\./g, ":")

export const padSequence = (seq: number | string | undefined): string => String(seq ?? 0).padStart(3, "0")
