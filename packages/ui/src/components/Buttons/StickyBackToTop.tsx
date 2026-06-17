import React, { useState, useEffect } from "react"
import { FloatingWrapper } from "./StickyBackToTop.styles"

export interface StickyBackToTopProps {
  href?: string
  text?: string
}

const OFFSET_COMPONENTS = 450

export const StickyBackToTop = ({ href = "#top", text = "Back to top" }: StickyBackToTopProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const passedTheFold = window.scrollY > OFFSET_COMPONENTS

      setIsVisible(passedTheFold)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <FloatingWrapper $isVisible={isVisible}>
      <a className="govuk-link govuk-link--no-visited-state" href={href}>
        <svg
          role="presentation"
          focusable="false"
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="17"
          viewBox="0 0 13 12"
        >
          <path fill="currentColor" d="M6.5 0L0 6.5 1.4 8l4-4v8.7h2V4l4.3 4L13 6.4z" />
        </svg>
        {text}
      </a>
    </FloatingWrapper>
  )
}
