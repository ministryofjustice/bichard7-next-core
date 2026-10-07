declare global {
  interface Window {
    TEST_INFO_BANNER_FIRST_SHOWN?: string
    TEST_INFO_BANNER_MESSAGE?: string
    TEST_INFO_BANNER_FORCES_VISIBLE_TO?: string
  }
}

export const bannerFirstShownDate = (firstShownDate?: Date): Date | undefined => {
  if (typeof window !== "undefined" && window.TEST_INFO_BANNER_FIRST_SHOWN) {
    return new Date(window.TEST_INFO_BANNER_FIRST_SHOWN)
  }

  return firstShownDate
}

export const bannerMessage = (message: string): string => {
  if (typeof window !== "undefined" && window.TEST_INFO_BANNER_MESSAGE) {
    return window.TEST_INFO_BANNER_MESSAGE
  }

  return message
}

export const bannerForcesVisibleTo = (forcesVisibleTo: string): string => {
  const value =
    typeof window !== "undefined" && window.TEST_INFO_BANNER_FORCES_VISIBLE_TO
      ? window.TEST_INFO_BANNER_FORCES_VISIBLE_TO
      : forcesVisibleTo

  return value === "ALL" ? "" : value
}
