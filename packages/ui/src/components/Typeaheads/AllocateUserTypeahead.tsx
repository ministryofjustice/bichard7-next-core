import { useCombobox } from "downshift"
import { useCallback, useEffect, useState } from "react"
import { ListWrapper } from "./Typeahead.styles"
import { UserLookupDto } from "@moj-bichard7/common/types/User"

interface Props {
  onSelect: (item: UserLookupDto | null) => void
}

const AllocateUserTypeahead: React.FC<Props> = ({ onSelect }: Props) => {
  const [inputItems, setInputItems] = useState<UserLookupDto[]>([])

  const fetchItems = useCallback(async (searchStringParam?: string, config?: { signal?: AbortSignal }) => {
    try {
      const params = new URLSearchParams()

      if (searchStringParam) {
        params.append("usernameOrName", searchStringParam)
      }

      const queryString = params.toString()
      const url = queryString
        ? `/bichard/api/court-cases/allocation/users?${queryString}`
        : `/bichard/api/court-cases/allocation/users`

      const response = await fetch(url, {
        method: "GET",
        signal: config?.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`)
      }

      const data = (await response.json()) as UserLookupDto[]
      setInputItems(data)
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return
      }
      console.error("Error fetching users:", error)
    }
  }, [])

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue } = useCombobox({
    defaultHighlightedIndex: 0,
    items: inputItems,
    itemToString: (item) => (item ? (item.fullname ?? "Unknown User") : ""),
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
        const typedValue = state.inputValue.trim()
        const exactMatch =
          inputItems.find((item) => item.fullname === typedValue) || (inputItems.length === 1 ? inputItems[0] : null)

        if (exactMatch) {
          return {
            ...changes,
            selectedItem: exactMatch,
            inputValue: exactMatch.fullname
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
          id: "allocate-user",
          placeholder: "Type a name to allocate..."
        })}
      />

      <ListWrapper>
        <ul {...getMenuProps()}>
          {isOpen
            ? inputItems.map((item, index) => (
                <li
                  style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                  key={`${item.id}-${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.fullname}
                </li>
              ))
            : null}
        </ul>
      </ListWrapper>
    </div>
  )
}

export default AllocateUserTypeahead
