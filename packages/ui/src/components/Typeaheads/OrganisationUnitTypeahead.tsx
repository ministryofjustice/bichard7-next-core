import { useCourtCase } from "context/CourtCaseContext"
import React from "react"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"
import { GenericTypeahead } from "./GenericTypeahead"

interface Props {
  resultIndex: number
  offenceIndex: number
  value?: string
  setOrganisations?: (OrganisationUnitApiResponse: OrganisationUnitApiResponse) => void
  setChanged?: (changed: boolean) => void
  setSaved?: (changed: boolean) => void
}

const OrganisationUnitTypeahead: React.FC<Props> = ({
  value,
  resultIndex,
  offenceIndex,
  setOrganisations,
  setChanged,
  setSaved
}) => {
  const { amend } = useCourtCase()

  return (
    <GenericTypeahead<OrganisationUnitApiResponse[0]>
      id="next-hearing-location"
      name="next-hearing-location"
      initialValue={value}
      fetchUrlBuilder={(search) => {
        const query = new URLSearchParams({ search })
        const queryString = query.toString()
        return queryString ? `/bichard/api/organisation-units?${queryString}` : `/bichard/api/force-owner`
      }}
      processData={(data) => {
        if (setOrganisations) {
          setOrganisations(data)
        }
        return data
      }}
      itemToString={(item) => item?.fullOrganisationCode ?? ""}
      getItemKey={(item, index) => `${item.fullOrganisationCode}-${index}`}
      renderItem={(item) => (
        <>
          {item.fullOrganisationCode}
          <span>{item.fullOrganisationName}</span>
        </>
      )}
      onInputValueChange={(inputValue) => {
        amend("nextSourceOrganisation")({
          resultIndex,
          offenceIndex,
          value: inputValue
        })
        if (setChanged) {
          setChanged(true)
        }
        if (setSaved) {
          setSaved(false)
        }
      }}
    />
  )
}

export default OrganisationUnitTypeahead
