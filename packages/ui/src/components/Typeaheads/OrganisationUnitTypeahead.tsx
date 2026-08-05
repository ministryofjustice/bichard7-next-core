import { OrganisationUnitsContext } from "@/context/OrganisationUnitsContext"
import { default as OrganisationUnitNameAndCode } from "@/types/OrganisationUnitNameAndCode"
import { searchOrganisationUnits } from "@/utils/organisationUnitTransformation/searchOrganisationUnitNameAndCode"
import { useCourtCase } from "context/CourtCaseContext"
import { useCombobox } from "downshift"
import { useContext, useEffect, useState } from "react"
import { ListWrapper } from "./Typeahead.styles"

interface Props {
  resultIndex: number
  offenceIndex: number
  value?: string
  setChanged?: (changed: boolean) => void
  setSaved?: (changed: boolean) => void
}

const OrganisationUnitTypeahead: React.FC<Props> = ({
  value,
  resultIndex,
  offenceIndex,
  setChanged,
  setSaved
}: Props) => {
  const { amend } = useCourtCase()
  const { organisationUnits } = useContext(OrganisationUnitsContext)
  const [inputItems, setInputItems] = useState<OrganisationUnitNameAndCode[]>([])

  const filterItems = (searchString?: string) => {
    const filtered = searchOrganisationUnits(searchString ?? "", organisationUnits)
    setInputItems(filtered)
  }

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue, setInputValue } =
    useCombobox({
      items: inputItems,
      onInputValueChange: ({ inputValue }) => {
        const codeToSave = (inputValue || "").split(" - ")[0].trim()

        amend("nextSourceOrganisation")({
          resultIndex: resultIndex,
          offenceIndex: offenceIndex,
          value: codeToSave
        })
        if (setChanged) {
          setChanged(true)
        }
        if (setSaved) {
          setSaved(false)
        }
      },
      initialInputValue: value,
      itemToString: (item) => (item ? `${item.fullOrganisationCode} - ${item.fullOrganisationName}` : "")
    })

  useEffect(() => {
    if (value && inputItems.length > 0 && inputValue === value) {
      const exactMatch = inputItems.find((i) => i.fullOrganisationCode === value)
      if (exactMatch) {
        setInputValue(`${exactMatch.fullOrganisationCode} - ${exactMatch.fullOrganisationName}`)
      }
    }
  }, [inputItems, value, inputValue, setInputValue])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      filterItems(inputValue)
    }, 250)

    return () => clearTimeout(delayDebounceFn)
  }, [filterItems, inputValue])

  return (
    <div>
      <input
        {...getInputProps({
          className: "govuk-input",
          id: "next-hearing-location",
          name: "next-hearing-location"
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
                  <span>
                    {item.fullOrganisationCode}
                    {" - "}
                    {item.fullOrganisationName}
                  </span>
                </li>
              ))
            : null}
        </ul>
      </ListWrapper>
    </div>
  )
}

export default OrganisationUnitTypeahead
