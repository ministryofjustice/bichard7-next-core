import { createContext, useContext } from "react"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"

interface OrganisationUnitsContextType {
  organisationUnits: OrganisationUnitApiResponse
}

const OrganisationUnitsContext = createContext<OrganisationUnitsContextType>({
  organisationUnits: []
})

const useOrganisationUnits = () => {
  const context = useContext(OrganisationUnitsContext)
  if (!context) {
    throw new Error("useOrganisationUnits must be used within an OrganisationUnitsProvider")
  }
  return context
}

OrganisationUnitsContext.displayName = "OrganisationUnitsContext"

export { OrganisationUnitsContext, useOrganisationUnits }
export type { OrganisationUnitsContextType }
