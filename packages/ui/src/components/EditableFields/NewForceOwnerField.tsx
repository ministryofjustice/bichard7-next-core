import { useState } from "react"
import type ForceOwnerApiResponse from "../../types/ForceOwnerApiResponse"
import ForceOwnerTypeahead from "components/Typeaheads/ForceOwnerTypeahead"

interface Props {
  currentForceOwner?: string
}

export const NewForceOwnerField = ({ currentForceOwner }: Props) => {
  const [selectedForce, setSelectedForce] = useState<ForceOwnerApiResponse[0] | null>(null)

  return (
    <>
      <input type="hidden" name="force" value={selectedForce?.forceCode ?? ""} />

      <ForceOwnerTypeahead onSelect={setSelectedForce} currentForceOwner={currentForceOwner} />
    </>
  )
}
