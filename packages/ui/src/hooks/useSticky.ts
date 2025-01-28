import type { RefObject } from "react"
import { useEffect } from "react"

interface StickyProps {
  setIsSticky: (value: boolean) => void
  ref: RefObject<HTMLDivElement>
  magicOffset: number
}

export const useSticky = ({ setIsSticky, ref, magicOffset }: StickyProps) => {
  useEffect(() => {
    const handleScroll = () => {
      const element = ref.current
      if (!element) {
        return
      }

      const scrollTop = window.scrollY
      const elementTop = element.getBoundingClientRect().top

      setIsSticky(scrollTop > elementTop + magicOffset)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
}
