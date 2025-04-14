declare global {
  interface Window {
    TEST_INFO_BANNER_FIRST_SHOWN?: string
  }
}

const resolveBannerFirstShownDate = (firstShownDate?: Date): Date | undefined => {
  if (typeof window !== "undefined" && window.TEST_INFO_BANNER_FIRST_SHOWN) {
    return new Date(window.TEST_INFO_BANNER_FIRST_SHOWN)
  }

  return firstShownDate
}

export default resolveBannerFirstShownDate
