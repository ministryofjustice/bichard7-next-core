import axios from "axios"
import { useCombobox } from "downshift"
import { useCallback, useEffect, useState } from "react"
import ForceOwnerApiResponse from "../types/ForceOwnerApiResponse"
import { isError } from "../types/Result"
import { ListWrapper } from "./OrganisationUnitTypeahead.styles"

interface Props {
  value?: string
  setForceOwners?: (ForceOwnerApiResponse: ForceOwnerApiResponse) => void
}

const ForceOwnerTypeahead: React.FC<Props> = ({ value, setForceOwners }: Props) => {
  const [inputItems, setInputItems] = useState<ForceOwnerApiResponse>([])

  const fetchItems = useCallback(
    async (searchStringParam?: string) => {
      const forceOwnersResponse = await axios
        .get<ForceOwnerApiResponse>("/bichard/api/force-owner", {
          params: {
            search: searchStringParam
          }
        })
        .then((response) => response.data)
        .catch((error) => error as Error)

      if (isError(forceOwnersResponse)) {
        return
      }

      setInputItems(forceOwnersResponse)

      if (setForceOwners) {
        setForceOwners(forceOwnersResponse)
      }
    },
    [setForceOwners]
  )

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps, inputValue } = useCombobox({
    items: inputItems,

    initialInputValue: value,
    itemToString: (item) => item?.forceCode ?? ""
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
          id: "force",
          name: "force",
          value
        })}
      />

      <ListWrapper>
        <ul {...getMenuProps()}>
          {isOpen
            ? inputItems.map((item, index) => (
                <li
                  style={highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}}
                  key={`${item}${index}`}
                  {...getItemProps({ item, index })}
                >
                  {item.forceCode}
                  <span>{item.forceName}</span>
                </li>
              ))
            : null}
        </ul>
      </ListWrapper>
    </div>
  )
}

export default ForceOwnerTypeahead
