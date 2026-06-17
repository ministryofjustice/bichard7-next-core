import { UserLookupDto } from "@moj-bichard7/common/types/User"
import React from "react"
import { GenericTypeahead } from "./GenericTypeahead"

interface Props {
  onSelect: (item: UserLookupDto | null) => void
}

const AllocateUserTypeahead: React.FC<Props> = ({ onSelect }) => {
  return (
    <GenericTypeahead<UserLookupDto>
      id="allocate-user"
      placeholder="Type a name to allocate..."
      fetchUrlBuilder={(search) =>
        search
          ? `/bichard/api/court-cases/allocation/users?usernameOrName=${encodeURIComponent(search)}`
          : "/bichard/api/court-cases/allocation/users"
      }
      itemToString={(item) => item?.fullname ?? "Unknown User"}
      getItemKey={(item, index) => `${item.id}-${index}`}
      renderItem={(item) => <>{item.fullname}</>}
      onSelectedItemChange={onSelect}
      onInputValueChange={(val) => {
        if (!val) {
          onSelect(null)
        }
      }}
      customBlurMatch={(typedValue, items) => {
        const trimmed = typedValue.trim()
        const exactMatch = items.find((item) => item.fullname === trimmed) || (items.length === 1 ? items[0] : null)

        return exactMatch ? { selectedItem: exactMatch, inputValue: exactMatch.fullname ?? "" } : null
      }}
      defaultHighlightedIndex={0}
    />
  )
}

export default AllocateUserTypeahead
