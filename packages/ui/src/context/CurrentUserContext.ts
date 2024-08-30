import { createContext, useContext } from "react"
import { DisplayFullUser } from "types/display/Users"

interface CurrentUserContextType {
  currentUser: DisplayFullUser
}

const CurrentUserContext = createContext<CurrentUserContextType | null>(null)

const useCurrentUser = (): DisplayFullUser => {
  const currentUserContext = useContext(CurrentUserContext)

  if (!currentUserContext) {
    throw new Error("currentUser has to be used within <CurrentUserContext.Provider>")
  }

  return currentUserContext.currentUser
}

CurrentUserContext.displayName = "CurrentUserContext"

export { CurrentUserContext, useCurrentUser }
export type { CurrentUserContextType }
