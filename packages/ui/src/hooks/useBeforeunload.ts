import { useEffect, useRef } from "react"

type BeforeUnloadHandler = (event: BeforeUnloadEvent) => string | void

export const useBeforeunload = (handler: BeforeUnloadHandler | undefined): void => {
  const enabled = handler !== undefined
  const handlerRef = useRef<BeforeUnloadHandler | undefined>(handler)

  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    if (enabled) {
      const listener = (event: BeforeUnloadEvent) => {
        const returnValue = handlerRef.current?.(event)
        if (typeof returnValue === "string") {
          event.preventDefault()
        }
      }

      window.addEventListener("beforeunload", listener)

      return () => {
        window.removeEventListener("beforeunload", listener)
      }
    }
  }, [enabled])
}
