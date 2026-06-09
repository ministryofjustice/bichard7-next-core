import { useCombobox } from "downshift"
import { useCallback, useEffect, useState } from "react"
import { ListWrapper } from "./Typeahead.styles"

interface Props {
  onSelect?: (item: AllocateUser | null) => void
}

type AllocateUser = {
  id: number
  name: string
}

export const AllocateUserTypeahead: React.FC<Props> = ({}: Props) => {
  const [inputItems, setInputItems] = useState<AllocateUser[]>([])

  const fetchItems = useCallback(() => {
    const items = [
      { id: 1, name: "Bob User" },
      { id: 2, name: "Alice User" },
      { id: 4, name: "Alex User" },
      { id: 3, name: "Dave User" }
    ]

    setInputItems(items)
  }, [])

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue } = useCombobox({
    defaultHighlightedIndex: 0,
    items: inputItems,
    itemToString: (item) => (item ? `${item.name}` : ""),
    // onSelectedItemChange: ({ selectedItem }) => {
    //   onSelect(selectedItem || null)
    // },
    // onInputValueChange: ({ inputValue: newVal }) => {
    //   if (!newVal) {
    //     onSelect(null)
    //   }
    // },
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges
      if (type === useCombobox.stateChangeTypes.InputBlur) {
        const typedValue = state.inputValue.trim() // TRIM added to handle accidental spaces/event quirks
        const exactMatch =
          inputItems.find((item) => item.name === typedValue) || (inputItems.length === 1 ? inputItems[0] : null)

        if (exactMatch) {
          return {
            ...changes,
            selectedItem: exactMatch,
            inputValue: exactMatch.name
          }
        }
      }
      return changes
    }
  })

  useEffect(() => {
    const abortController = new AbortController()

    const delayDebounceFn = setTimeout(() => {
      fetchItems()
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
          id: "force",
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
                  {item.name}
                </li>
              ))
            : null}
        </ul>
      </ListWrapper>
    </div>
  )
}
