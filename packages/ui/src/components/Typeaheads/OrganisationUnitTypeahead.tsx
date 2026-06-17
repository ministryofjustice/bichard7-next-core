import { useCourtCase } from "context/CourtCaseContext"
import { useCombobox } from "downshift"
import { useCallback, useEffect, useState } from "react"
import OrganisationUnitApiResponse from "types/OrganisationUnitApiResponse"
import { isError } from "types/Result"
import { ListWrapper } from "./Typeahead.styles"

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
}: Props) => {
  const { amend } = useCourtCase()
  const [inputItems, setInputItems] = useState<OrganisationUnitApiResponse>([])

  const fetchItems = useCallback(
    async (searchStringParam?: string) => {
      const query = new URLSearchParams({ search: searchStringParam ?? "" })

      const queryString = query.toString()
      const url = queryString ? `/bichard/api/organisation-units?${queryString}` : `/bichard/api/force-owner`

      const organisationUnitsResponse = await fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`)
          }

          return response.json() as Promise<OrganisationUnitApiResponse>
        })
        .catch((error) => error as Error)

      if (isError(organisationUnitsResponse)) {
        return
      }

      setInputItems(organisationUnitsResponse)

      if (setOrganisations) {
        setOrganisations(organisationUnitsResponse)
      }
    },
    [setOrganisations]
  )

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue } = useCombobox({
    items: inputItems,

    onInputValueChange: ({ inputValue }) => {
      amend("nextSourceOrganisation")({
        resultIndex: resultIndex,
        offenceIndex: offenceIndex,
        value: inputValue
      })
      if (setChanged) {
        setChanged(true)
      }
      if (setSaved) {
        setSaved(false)
      }
    },
    initialInputValue: value,
    itemToString: (item) => item?.fullOrganisationCode ?? ""
  })

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(inputValue)
    }, 250)

    return () => clearTimeout(delayDebounceFn)
  }, [fetchItems, inputValue])

  return (
    <div>
      <input
        {...getInputProps({
          className: "govuk-input",
          id: "next-hearing-location",
          name: "next-hearing-location",
          value
        })}
      />

      <ListWrapper>
        <ul {...getMenuProps()}>
          {isOpen
            ? inputItems.map((item, index) => (
                <li
                  style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                  key={`${item.fullOrganisationCode}-${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.fullOrganisationCode}
                  <span>{item.fullOrganisationName}</span>
                </li>
              ))
            : null}
        </ul>
      </ListWrapper>
    </div>
  )
}

export default OrganisationUnitTypeahead
