import { getForceAcronym } from "@/services/searchForceOwners"
import React, { useCallback } from "react"
import type ForceOwnerApiResponse from "types/ForceOwnerApiResponse"
import { GenericTypeahead } from "./GenericTypeahead"

type ForceOwnerDetails = { forceCode: string; forceName: string; forceAcronym?: string }

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

  const formatForceName = (item: ForceOwnerDetails) => {
    const forceAcronym = item.forceAcronym ? ` (${item.forceAcronym})` : ""

    return `${item.forceCode} - ${item.forceName}${forceAcronym}`
  }

  const processData = useCallback(
    (data: ForceOwnerApiResponse) => {
      return data
        .map((item) => {
          const forceAcronym = getForceAcronym(item.forceCode)
          if (forceAcronym) {
            return {
              ...item,
              forceAcronym: forceAcronym
            }
          }

          return item
        })
        .filter((item) => currentForceOwner !== item.forceCode)
    },
    [currentForceOwner]
  )

  return (
    <GenericTypeahead<ForceOwnerDetails>
      id="force"
      fetchUrlBuilder={fetchUrlBuilder}
      processData={processData}
      itemToString={(item) => (item ? formatForceName(item) : "")}
      getItemKey={(item, index) => `${item.forceCode}-${index}`}
      renderItem={(item) => {
        const forceAcronymFragment = item.forceAcronym ? (
          <>
            {" ("}
            {item.forceAcronym}
            {")"}
          </>
        ) : null

        return (
          <>
            {item.forceCode}
            {" - "}
            {item.forceName}
            {forceAcronymFragment}
          </>
        )
      }}
      onSelectedItemChange={onSelect}
      onInputValueChange={(val) => {
        if (!val) {
          onSelect(null)
        }
      }}
      customBlurMatch={(typedValue, items) => {
        const trimmed = typedValue.trim()

        const exactMatch =
          items.find((item) => {
            return item.forceCode === trimmed || formatForceName(item) === trimmed
          }) || (items.length === 1 ? items[0] : null)

        return exactMatch ? { selectedItem: exactMatch, inputValue: formatForceName(exactMatch) } : null
      }}
      defaultHighlightedIndex={0}
      showError={showError}
    />
  )
}

export default ForceOwnerTypeahead
