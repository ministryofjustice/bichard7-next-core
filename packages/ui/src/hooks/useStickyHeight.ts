import type { RefObject } from "react"
import { useEffect } from "react"

interface StickyProps {
  setStickyHeight: (value: number) => void
  ref: RefObject<HTMLElement> | RefObject<HTMLDivElement>
  magicOffset: number
}

export const useStickyHeight = ({ setStickyHeight, ref, magicOffset }: StickyProps) => {
  useEffect(() => {
    const handleScrollAndResize = () => {
      const element = ref.current
      if (!element) {
        return
      }

      setStickyHeight(window.innerHeight - magicOffset)
    }

    window.addEventListener("scroll", handleScrollAndResize)
    window.addEventListener("resize", handleScrollAndResize)

    return () => {
      window.addEventListener("scroll", handleScrollAndResize)
      window.addEventListener("resize", handleScrollAndResize)
    }
  }, [])
}
