import type { Dispatch, SetStateAction } from "react"
import { createContext, useCallback, useContext, useState } from "react"

interface CsrfTokenContextType {
  csrfToken: string
}

interface CsrfTokenContextResult {
  csrfToken: string
  updateCsrfToken: (csrfToken: string) => void
}

type CsrfTokenContextInput = [CsrfTokenContextType, Dispatch<SetStateAction<CsrfTokenContextType>>]

const CsrfTokenContext = createContext<CsrfTokenContextInput | null>(null)

const useCsrfToken = (): CsrfTokenContextResult => {
  const csrfTokenContext = useContext(CsrfTokenContext)

  if (!csrfTokenContext) {
    throw new Error("csrfToken has to be used within <CsrfTokenContext.Provider>")
  }

  const [context, setContext] = csrfTokenContext

  const updateCsrfToken = useCallback(
    (newCsrfToken: string) => {
      setContext((previousContext) => {
        return { ...previousContext, csrfToken: newCsrfToken }
      })
    },
    [setContext]
  )

  return {
    csrfToken: context.csrfToken,
    updateCsrfToken
  }
}

const useCsrfTokenContextState = (csrfToken: string) => useState<CsrfTokenContextType>({ csrfToken })

CsrfTokenContext.displayName = "CsrfTokenContext"

export { CsrfTokenContext, useCsrfToken, useCsrfTokenContextState }
export type { CsrfTokenContextResult, CsrfTokenContextType }
