import axios from "axios"
import { useCourtCase } from "context/CourtCaseContext"
import { useCombobox } from "downshift"
import { Input } from "govuk-react"
import { useCallback, useEffect, useState } from "react"

import OrganisationUnitApiResponse from "../types/OrganisationUnitApiResponse"
import { isError } from "../types/Result"
import { ListWrapper } from "./OrganisationUnitTypeahead.styles"

interface Props {
  offenceIndex: number
  resultIndex: number
  setChanged?: (changed: boolean) => void
  setOrganisations?: (OrganisationUnitApiResponse: OrganisationUnitApiResponse) => void
  setSaved?: (changed: boolean) => void
  value?: string
}

const OrganisationUnitTypeahead: React.FC<Props> = ({
  offenceIndex,
  resultIndex,
  setChanged,
  setOrganisations,
  setSaved,
  value
}: Props) => {
  const { amend } = useCourtCase()
  const [inputItems, setInputItems] = useState<OrganisationUnitApiResponse>([])

  const fetchItems = useCallback(
    async (searchStringParam?: string) => {
      const organisationUnitsResponse = await axios
        .get<OrganisationUnitApiResponse>("/bichard/api/organisation-units", {
          params: {
            search: searchStringParam
          }
        })
        .then((response) => response.data)
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

  const { getInputProps, getItemProps, getMenuProps, highlightedIndex, inputValue, isOpen } = useCombobox({
    initialInputValue: value,
    items: inputItems,
    itemToString: (item) => item?.fullOrganisationCode ?? "",
    // eslint-disable-next-line @typescript-eslint/no-shadow
    onInputValueChange: ({ inputValue }) => {
      amend("nextSourceOrganisation")({
        offenceIndex: offenceIndex,
        resultIndex: resultIndex,
        value: inputValue
      })
      if (setChanged) {
        setChanged(true)
      }
      if (setSaved) {
        setSaved(false)
      }
    }
  })

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(inputValue)
    }, 250)

    return () => clearTimeout(delayDebounceFn)
  }, [fetchItems, inputValue])

  return (
    <div>
      <Input
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
                  key={`${item}${index}`}
                  style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                  {...getItemProps({ index, item })}
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
