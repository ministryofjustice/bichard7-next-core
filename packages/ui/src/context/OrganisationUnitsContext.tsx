import React, { createContext, useContext, useMemo } from "react"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"

interface OrganisationUnitsContextType {
  organisationUnits: OrganisationUnitApiResponse
}

const OrganisationUnitsContext = createContext<OrganisationUnitsContextType>({
  organisationUnits: []
})

export const OrganisationUnitsProvider: React.FC<{
  children: React.ReactNode
  organisationUnits: OrganisationUnitApiResponse
}> = ({ children, organisationUnits }) => {
  const value = useMemo(() => ({ organisationUnits }), [organisationUnits])

  return <OrganisationUnitsContext.Provider value={value}>{children}</OrganisationUnitsContext.Provider>
}

export const useOrganisationUnits = () => {
  const context = useContext(OrganisationUnitsContext)
  if (!context) {
    throw new Error("useOrganisationUnits must be used within an OrganisationUnitsProvider")
  }
  return context
}
