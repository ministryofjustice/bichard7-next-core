import { OrganisationUnit } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { createContext, useContext } from "react"

interface OrganisationUnitsContextType {
  organisationUnits: OrganisationUnit[]
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
