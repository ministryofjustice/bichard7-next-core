import { useCombobox } from "downshift"
import { useCallback, useEffect, useState } from "react"
import { ListWrapper } from "./Typeahead.styles"

interface GenericTypeaheadProps<T> {
  id: string
  name?: string
  placeholder?: string
  initialValue?: string

  fetchUrlBuilder: (inputValue: string) => string
  processData?: (data: T[]) => T[]

  itemToString: (item: T | null) => string
  renderItem: (item: T) => React.ReactNode
  getItemKey: (item: T, index: number) => string

  onSelectedItemChange?: (selectedItem: T | null) => void
  onInputValueChange?: (value: string) => void
  customBlurMatch?: (inputValue: string, items: T[]) => { selectedItem: T; inputValue: string } | null

  defaultHighlightedIndex?: number
}

export function GenericTypeahead<T>({
  id,
  name,
  placeholder,
  initialValue,
  fetchUrlBuilder,
  processData,
  itemToString,
  renderItem,
  getItemKey,
  onSelectedItemChange,
  onInputValueChange,
  customBlurMatch,
  defaultHighlightedIndex
}: Readonly<GenericTypeaheadProps<T>>) {
  const [inputItems, setInputItems] = useState<T[]>([])

  const fetchItems = useCallback(
    async (searchString: string, config?: { signal?: AbortSignal }) => {
      try {
        const url = fetchUrlBuilder(searchString)
        const response = await fetch(url, { method: "GET", signal: config?.signal })

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`)
        }

        let data = (await response.json()) as T[]
        if (processData) {
          data = processData(data)
        }
        setInputItems(data)
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return
        }
        console.error(`Error fetching items for typeahead (${id}):`, error)
      }
    },
    [fetchUrlBuilder, processData, id]
  )

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue } = useCombobox({
    defaultHighlightedIndex: defaultHighlightedIndex,
    initialInputValue: initialValue,
    items: inputItems,
    itemToString,
    onSelectedItemChange: ({ selectedItem }) => {
      if (onSelectedItemChange) {
        onSelectedItemChange(selectedItem || null)
      }
    },
    onInputValueChange: ({ inputValue: newVal }) => {
      if (onInputValueChange) {
        onInputValueChange(newVal || "")
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { type, changes } = actionAndChanges

      if (type === useCombobox.stateChangeTypes.InputBlur && customBlurMatch) {
        const match = customBlurMatch(state.inputValue || "", inputItems)
        if (match) {
          return {
            ...changes,
            selectedItem: match.selectedItem,
            inputValue: match.inputValue
          }
        }
      }
      return changes
    }
  })

  useEffect(() => {
    const abortController = new AbortController()

    const delayDebounceFn = setTimeout(() => {
      fetchItems(inputValue || "", { signal: abortController.signal })
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
          id,
          name,
          placeholder
        })}
      />

      <ListWrapper>
        <ul {...getMenuProps()}>
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                key={getItemKey(item, index)}
                {...getItemProps({ item, index })}
              >
                {renderItem(item)}
              </li>
            ))}
        </ul>
      </ListWrapper>
    </div>
  )
}
