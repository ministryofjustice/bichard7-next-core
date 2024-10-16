import { createContext, useContext } from "react"

interface CsrfTokenContextType {
  csrfToken: string
}

const CsrfTokenContext = createContext<CsrfTokenContextType | null>(null)

const useCsrfToken = (): string => {
  const csrfTokenContext = useContext(CsrfTokenContext)

  if (!csrfTokenContext) {
    throw new Error("csrfToken has to be used within <CsrfTokenContext.Provider>")
  }

  return csrfTokenContext.csrfToken
}

CsrfTokenContext.displayName = "CsrfTokenContext"

export { CsrfTokenContext, useCsrfToken }
export type { CsrfTokenContextType }
