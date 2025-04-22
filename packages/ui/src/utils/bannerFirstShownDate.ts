declare global {
  interface Window {
    TEST_INFO_BANNER_FIRST_SHOWN?: string
  }
}

const bannerFirstShownDate = (firstShownDate?: Date): Date | undefined => {
  if (typeof window !== "undefined" && window.TEST_INFO_BANNER_FIRST_SHOWN) {
    return new Date(window.TEST_INFO_BANNER_FIRST_SHOWN)
  }

  return firstShownDate
}

export default bannerFirstShownDate
