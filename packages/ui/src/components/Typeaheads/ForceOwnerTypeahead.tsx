import { useCombobox } from "downshift"
import { useCallback, useEffect, useState } from "react"
import type ForceOwnerApiResponse from "types/ForceOwnerApiResponse"
import { ListWrapper } from "./Typeahead.styles"

interface Props {
  onSelect: (item: ForceOwnerApiResponse[0] | null) => void
  currentForceOwner?: string
}

const ForceOwnerTypeahead: React.FC<Props> = ({ onSelect, currentForceOwner }: Props) => {
  const [inputItems, setInputItems] = useState<ForceOwnerApiResponse>([])

  const fetchItems = useCallback(
    async (searchStringParam?: string, config?: { signal?: AbortSignal }) => {
      try {
        const params = new URLSearchParams()

        if (currentForceOwner) {
          params.append("currentForceOwner", currentForceOwner)
        }

        if (searchStringParam) {
          params.append("search", searchStringParam)
        }

        const queryString = params.toString()
        const url = queryString ? `/bichard/api/force-owner?${queryString}` : `/bichard/api/force-owner`

        const response = await fetch(url, {
          method: "GET",
          signal: config?.signal
        })

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        const data = (await response.json()) as ForceOwnerApiResponse
        const filteredForceOwners = data.filter((item) => currentForceOwner !== item.forceCode)

        setInputItems(filteredForceOwners)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }
        console.error("Error fetching force owners:", error)
      }
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
    },
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges
      if (type === useCombobox.stateChangeTypes.InputBlur) {
        const typedValue = state.inputValue.trim() // TRIM added to handle accidental spaces/event quirks
        const exactMatch =
          inputItems.find(
            (item) => item.forceCode === typedValue || `${item.forceCode} - ${item.forceName}` === typedValue
          ) || (inputItems.length === 1 ? inputItems[0] : null)

        if (exactMatch) {
          return {
            ...changes,
            selectedItem: exactMatch,
            inputValue: `${exactMatch.forceCode} - ${exactMatch.forceName}`
          }
        }
      }
      return changes
    }
  })

  useEffect(() => {
    const abortController = new AbortController()

    const delayDebounceFn = setTimeout(() => {
      fetchItems(inputValue, { signal: abortController.signal })
    }, 250)

    return () => {
      clearTimeout(delayDebounceFn)
      abortController.abort()
    }
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
