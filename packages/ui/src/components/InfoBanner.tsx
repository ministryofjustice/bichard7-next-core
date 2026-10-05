import { INFO_BANNER_FORCES_VISIBLE_TO, INFO_BANNER_LIFESPAN_DAYS } from "@/config"
import { addDays, format, isAfter, isFuture } from "date-fns"
import Link from "next/link"
import { useEffect, useState } from "react"
import { LocalStorageKey } from "types/Ui"
import { Banner, CloseButton } from "./InfoBanner.styles"

interface Props {
  firstShownDate: Date | undefined
  message: string
  href: string
  visibleForces: string[]
}

function hasNoForcesInCommon(visibleForces: string[]): boolean {
  const set1 = new Set(visibleForces)
  return !INFO_BANNER_FORCES_VISIBLE_TO.some((item) => set1.has(item))
}

const InfoBanner = ({ message, firstShownDate, href, visibleForces }: Props) => {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (!firstShownDate) {
      return
    }

    if (INFO_BANNER_FORCES_VISIBLE_TO?.length > 0 && hasNoForcesInCommon(visibleForces)) {
      return
    }

    const bannerShownInFuture = isFuture(firstShownDate)
    const bannerExpired = isAfter(new Date(), addDays(firstShownDate, INFO_BANNER_LIFESPAN_DAYS))

    if (bannerShownInFuture || bannerExpired) {
      return
    }

    const lastClosed = localStorage.getItem(LocalStorageKey.InfoBannerLastClosed)
    const dateFormat = "yyyy-MM-dd"

    if (lastClosed && format(lastClosed, dateFormat) === format(new Date(), dateFormat)) {
      return
    }

    setVisible(true)
  }, [firstShownDate])

  const handleClose = () => {
    setVisible(false)
    localStorage.setItem(LocalStorageKey.InfoBannerLastClosed, new Date().toISOString())
  }

  if (!mounted || !visible) {
    return null
  }

  return (
    <Banner className="info-banner" role="region" aria-labelledby="info-banner-text">
      <svg
        className="moj-banner__icon"
        fill="currentColor"
        role="presentation"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        height="25"
        width="25"
      >
        <path d="M13.7,18.5h-2.4v-2.4h2.4V18.5z M12.5,13.7c-0.7,0-1.2-0.5-1.2-1.2V7.7c0-0.7,0.5-1.2,1.2-1.2s1.2,0.5,1.2,1.2v4.8 C13.7,13.2,13.2,13.7,12.5,13.7z M12.5,0.5c-6.6,0-12,5.4-12,12s5.4,12,12,12s12-5.4,12-12S19.1,0.5,12.5,0.5z" />
      </svg>

      <span className="info-banner__text" id="info-banner-text">
        {message}
      </span>

      <span>
        {"\u00A0"}
        {"View "}
        <Link href={href} target={"_blank"}>
          {"the help guidance for new features"}
        </Link>
      </span>
      {"."}

      <CloseButton className="info-banner__close" onClick={handleClose} aria-label="Close banner" />
    </Banner>
  )
}

export default InfoBanner
