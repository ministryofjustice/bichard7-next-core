import { useCallback, useRef } from "react"

export const useAnnouncer = () => {
  const announcerRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message
    }
  }, [])

  return { announce, announcerRef }
}
