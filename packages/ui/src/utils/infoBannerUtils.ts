import { addDays, isAfter, isFuture } from "date-fns"

declare global {
  interface Window {
    TEST_INFO_BANNER_FIRST_SHOWN?: string
    TEST_INFO_BANNER_MESSAGE?: string
    TEST_INFO_BANNER_FORCES_VISIBLE_TO?: string
    TEST_INFO_BANNER_LIFESPAN?: number
  }
}

export const bannerFirstShownDate = (firstShownDate?: Date): Date | undefined => {
  if (typeof window !== "undefined" && window.TEST_INFO_BANNER_FIRST_SHOWN) {
    return new Date(window.TEST_INFO_BANNER_FIRST_SHOWN)
  }

  return firstShownDate
}

export const bannerMessage = (message?: string): string | undefined => {
  if (typeof window !== "undefined" && window.TEST_INFO_BANNER_MESSAGE) {
    return window.TEST_INFO_BANNER_MESSAGE
  }

  return message
}

export const bannerLifespan = (days: number): number => {
  if (typeof window !== "undefined" && window.TEST_INFO_BANNER_LIFESPAN) {
    return window.TEST_INFO_BANNER_LIFESPAN
  }

  return days
}

export const bannerForcesVisibleTo = (forcesVisibleTo: string): string => {
  const value =
    typeof window !== "undefined" && window.TEST_INFO_BANNER_FORCES_VISIBLE_TO
      ? window.TEST_INFO_BANNER_FORCES_VISIBLE_TO
      : forcesVisibleTo

  return value === "ALL" ? "" : value
}

export interface ShouldDisplayInfoBannerParams {
  message?: string
  userVisibleForces: string[]
  forcesFilter: Set<string>
  firstShownDate?: Date
  lifespanDays?: number
}

export const shouldDisplayInfoBanner = ({
  message,
  userVisibleForces,
  forcesFilter,
  firstShownDate,
  lifespanDays
}: ShouldDisplayInfoBannerParams): boolean => {
  if (!firstShownDate || !message || !lifespanDays) {
    return false
  }

  const hasMatchingForce = forcesFilter.size === 0 || userVisibleForces.some((force) => forcesFilter.has(force))

  if (!hasMatchingForce) {
    return false
  }

  const bannerShownInFuture = isFuture(firstShownDate)
  const bannerExpired = isAfter(new Date(), addDays(firstShownDate, lifespanDays))

  if (bannerShownInFuture || bannerExpired) {
    return false
  }

  return true
}
