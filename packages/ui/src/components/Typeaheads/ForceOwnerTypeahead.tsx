import React, { useCallback } from "react"
import type ForceOwnerApiResponse from "types/ForceOwnerApiResponse"
import { GenericTypeahead } from "./GenericTypeahead"

interface Props {
  onSelect: (item: ForceOwnerApiResponse[0] | null) => void
  currentForceOwner?: string
  showError?: boolean
}

const ForceOwnerTypeahead: React.FC<Props> = ({ onSelect, currentForceOwner, showError }) => {
  const fetchUrlBuilder = useCallback(
    (search: string) => {
      const params = new URLSearchParams()
      if (currentForceOwner) {
        params.append("currentForceOwner", currentForceOwner)
      }
      if (search) {
        params.append("search", search)
      }

      const queryString = params.toString()
      return queryString ? `/bichard/api/force-owner?${queryString}` : `/bichard/api/force-owner`
    },
    [currentForceOwner]
  )

  const processData = useCallback(
    (data: ForceOwnerApiResponse) => {
      return data.filter((item) => currentForceOwner !== item.forceCode)
    },
    [currentForceOwner]
  )

  return (
    <GenericTypeahead<ForceOwnerApiResponse[0]>
      id="force"
      fetchUrlBuilder={fetchUrlBuilder}
      processData={processData}
      itemToString={(item) => (item ? `${item.forceCode} - ${item.forceName}` : "")}
      getItemKey={(item, index) => `${item.forceCode}-${index}`}
      renderItem={(item) => (
        <>
          {item.forceCode}
          {" - "}
          {item.forceName}
        </>
      )}
      onSelectedItemChange={onSelect}
      onInputValueChange={(val) => {
        if (!val) {
          onSelect(null)
        }
      }}
      customBlurMatch={(typedValue, items) => {
        const trimmed = typedValue.trim()
        const exactMatch =
          items.find((item) => item.forceCode === trimmed || `${item.forceCode} - ${item.forceName}` === trimmed) ||
          (items.length === 1 ? items[0] : null)

        return exactMatch
          ? { selectedItem: exactMatch, inputValue: `${exactMatch.forceCode} - ${exactMatch.forceName}` }
          : null
      }}
      defaultHighlightedIndex={0}
      showError={showError}
    />
  )
}

export default ForceOwnerTypeahead
