import Link from "next/link"
import { useEffect, useState } from "react"
import { Banner, CloseButton } from "./InfoBanner.styles"

const InfoBanner = () => {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const isClosed = sessionStorage.getItem("infoBannerClosed")
    if (!isClosed) {
      setVisible(true)
    }
  }, [])

  const handleClose = () => {
    setVisible(false)
    sessionStorage.setItem("infoBannerClosed", "true")
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
        {"There are new features available on new Bichard."}
      </span>

      <span>
        {"\u00A0"}
        {"View "}
        <Link href={"/help/whats-new"} target={"_blank"}>
          {"the help guidance for new features"}
        </Link>
      </span>
      {"."}

      <CloseButton onClick={handleClose} aria-label="Close banner" />
    </Banner>
  )
}

export default InfoBanner
