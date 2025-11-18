import axios from "axios"
import { useCombobox } from "downshift"
import { useCallback, useEffect, useState } from "react"
import type ForceOwnerApiResponse from "../types/ForceOwnerApiResponse"
import { isError } from "../types/Result"
import { ListWrapper } from "./OrganisationUnitTypeahead.styles"

interface Props {
  onSelect: (item: ForceOwnerApiResponse[0] | null) => void
  currentForceOwner?: string
}

const ForceOwnerTypeahead: React.FC<Props> = ({ onSelect, currentForceOwner }: Props) => {
  const [inputItems, setInputItems] = useState<ForceOwnerApiResponse>([])

  const fetchItems = useCallback(
    async (searchStringParam?: string) => {
      const forceOwnersResponse = await axios
        .get<ForceOwnerApiResponse>("/bichard/api/force-owner", {
          params: {
            currentForceOwner,
            search: searchStringParam
          }
        })
        .then((response) => response.data)
        .catch((error) => error as Error)

      if (isError(forceOwnersResponse)) {
        return
      }

      const filteredForceOwners = forceOwnersResponse.filter((item) => currentForceOwner !== item.forceCode)
      setInputItems(filteredForceOwners)
    },
    [currentForceOwner]
  )

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue } = useCombobox({
    defaultHighlightedIndex: 0,
    items: inputItems,
    itemToString: (item) => (item ? `${item.forceCode} - ${item.forceName}` : ""),
    onSelectedItemChange: ({ selectedItem }) => {
      onSelect(selectedItem || null)
    },
    onInputValueChange: ({ inputValue: newVal }) => {
      if (!newVal) {
        onSelect(null)
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
      <input
        {...getInputProps({
          className: "govuk-input",
          id: "force"
        })}
      />

      <ListWrapper>
        <ul {...getMenuProps()}>
          {isOpen
            ? inputItems.map((item, index) => (
                <li
                  style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                  key={`${item.forceCode}-${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.forceCode}
                  {" - "}
                  {item.forceName}
                </li>
              ))
            : null}
        </ul>
      </ListWrapper>
    </div>
  )
}

export default ForceOwnerTypeahead
