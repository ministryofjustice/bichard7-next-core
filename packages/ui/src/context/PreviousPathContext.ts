import { createContext, useContext } from "react"

interface PreviousPathContextType {
  previousPath: string
}

const PreviousPathContext = createContext<null | PreviousPathContextType>(null)

const usePreviousPath = (): string => {
  const previousPathContext = useContext(PreviousPathContext)

  if (!previousPathContext) {
    throw new Error("previousPath has to be used within <PreviousPathContext.Provider>")
  }

  return previousPathContext.previousPath
}

PreviousPathContext.displayName = "PreviousPathContext"

export { PreviousPathContext, usePreviousPath }
export type { PreviousPathContextType }
