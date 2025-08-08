import { useCallback, useState } from "react"

const useContentToggle = (initialState = true) => {
  const [isContentVisible, setIsContentVisible] = useState(initialState)

  const toggleContentVisibility = useCallback(() => {
    setIsContentVisible((prev) => !prev)
  }, [])

  return { isContentVisible, toggleContentVisibility, setIsContentVisible }
}

export default useContentToggle
